const BulkDeal = require('../models/BulkDeal');
const BulkBuyInquiry = require('../models/BulkBuyInquiry');
const Project = require('../models/Project');
const Property = require('../models/Property');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET /public/bulk-deals
exports.getPublicBulkDeals = async (req, res, next) => {
  try {
    const deals = await BulkDeal.find({ isAvailable: true })
      .populate('projectId', 'name code city location bannerImage priceRange')
      .populate('propertyId', 'title slug city area heroImage priceRange')
      .sort({ isFeatured: -1, order: 1, createdAt: -1 });
    res.json(deals);
  } catch (error) {
    next(error);
  }
};

// GET /public/bulk-deals/:slug
exports.getPublicBulkDealBySlug = async (req, res, next) => {
  try {
    const deal = await BulkDeal.findOne({ slug: req.params.slug, isAvailable: true })
      .populate('projectId')
      .populate('propertyId');
    if (!deal) {
      return res.status(404).json({ message: 'Bulk deal not found' });
    }
    res.json(deal);
  } catch (error) {
    next(error);
  }
};

// POST /public/bulk-deals/request
exports.submitBulkDealRequest = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      bulkDealId,
      dealTitle,
      unitCount,
      budgetRange,
      city,
      message
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    let resolvedTitle = dealTitle || '';
    if (bulkDealId) {
      const deal = await BulkDeal.findById(bulkDealId);
      if (deal && !resolvedTitle) {
        resolvedTitle = deal.title;
      }
    }

    const inquiry = await BulkBuyInquiry.create({
      name: String(name).trim(),
      email: String(email || '').trim(),
      phone: String(phone).trim(),
      unitCount: Number(unitCount) || 5,
      budgetRange: String(budgetRange || '').trim(),
      city: String(city || '').trim(),
      propertyTitle: resolvedTitle || 'Bulk Deal Inquiry',
      message: String(message || '').trim(),
      status: 'NEW',
      source: 'BULK_DEALS_PAGE'
    });

    res.status(201).json({
      message: 'Bulk deal quote request submitted successfully. Our investment desk will get in touch shorty.',
      inquiryId: inquiry._id
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/bulk-deals
exports.getAdminBulkDeals = async (req, res, next) => {
  try {
    const deals = await BulkDeal.find()
      .populate('projectId', 'name code city location')
      .populate('propertyId', 'title slug city')
      .sort({ createdAt: -1 });
    res.json(deals);
  } catch (error) {
    next(error);
  }
};

// POST /admin/bulk-deals
exports.createBulkDeal = async (req, res, next) => {
  try {
    const {
      title,
      dealType,
      projectId,
      propertyId,
      location,
      city,
      state,
      originalPriceDisplay,
      bulkPriceDisplay,
      discountPercentage,
      minQuantity,
      totalPackageUnits,
      perks,
      bannerImage,
      bannerImageS3Key,
      description,
      isAvailable,
      isFeatured,
      validTill,
      order
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await BulkDeal.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newDeal = await BulkDeal.create({
      title: String(title).trim(),
      slug,
      dealType: dealType || 'PROJECT',
      projectId: projectId || null,
      propertyId: propertyId || null,
      location: String(location || '').trim(),
      city: String(city || '').trim(),
      state: String(state || '').trim(),
      originalPriceDisplay: String(originalPriceDisplay || '').trim(),
      bulkPriceDisplay: String(bulkPriceDisplay || '').trim(),
      discountPercentage: Number(discountPercentage) || 0,
      minQuantity: String(minQuantity || '5 Plots').trim(),
      totalPackageUnits: String(totalPackageUnits || '10 Packages Available').trim(),
      perks: Array.isArray(perks) ? perks.map(p => String(p).trim()).filter(Boolean) : [],
      bannerImage: String(bannerImage || '').trim(),
      bannerImageS3Key: String(bannerImageS3Key || '').trim(),
      description: String(description || '').trim(),
      isAvailable: isAvailable !== false,
      isFeatured: Boolean(isFeatured),
      validTill: validTill ? new Date(validTill) : null,
      order: Number(order) || 0,
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ message: 'Bulk deal created successfully', deal: newDeal });
  } catch (error) {
    next(error);
  }
};

// PUT /admin/bulk-deals/:id
exports.updateBulkDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await BulkDeal.findById(id);
    if (!deal) {
      return res.status(404).json({ message: 'Bulk deal not found' });
    }

    const {
      title,
      dealType,
      projectId,
      propertyId,
      location,
      city,
      state,
      originalPriceDisplay,
      bulkPriceDisplay,
      discountPercentage,
      minQuantity,
      totalPackageUnits,
      perks,
      bannerImage,
      bannerImageS3Key,
      description,
      isAvailable,
      isFeatured,
      validTill,
      order
    } = req.body;

    if (title && title !== deal.title) {
      deal.title = String(title).trim();
      let baseSlug = slugify(deal.title);
      let slug = baseSlug;
      let counter = 1;
      while (await BulkDeal.exists({ slug, _id: { $ne: deal._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      deal.slug = slug;
    }

    if (dealType !== undefined) deal.dealType = dealType;
    if (projectId !== undefined) deal.projectId = projectId || null;
    if (propertyId !== undefined) deal.propertyId = propertyId || null;
    if (location !== undefined) deal.location = String(location).trim();
    if (city !== undefined) deal.city = String(city).trim();
    if (state !== undefined) deal.state = String(state).trim();
    if (originalPriceDisplay !== undefined) deal.originalPriceDisplay = String(originalPriceDisplay).trim();
    if (bulkPriceDisplay !== undefined) deal.bulkPriceDisplay = String(bulkPriceDisplay).trim();
    if (discountPercentage !== undefined) deal.discountPercentage = Number(discountPercentage) || 0;
    if (minQuantity !== undefined) deal.minQuantity = String(minQuantity).trim();
    if (totalPackageUnits !== undefined) deal.totalPackageUnits = String(totalPackageUnits).trim();
    if (perks !== undefined && Array.isArray(perks)) deal.perks = perks.map(p => String(p).trim()).filter(Boolean);
    if (bannerImage !== undefined) deal.bannerImage = String(bannerImage).trim();
    if (bannerImageS3Key !== undefined) deal.bannerImageS3Key = String(bannerImageS3Key).trim();
    if (description !== undefined) deal.description = String(description).trim();
    if (isAvailable !== undefined) deal.isAvailable = Boolean(isAvailable);
    if (isFeatured !== undefined) deal.isFeatured = Boolean(isFeatured);
    if (validTill !== undefined) deal.validTill = validTill ? new Date(validTill) : null;
    if (order !== undefined) deal.order = Number(order) || 0;

    await deal.save();
    res.json({ message: 'Bulk deal updated successfully', deal });
  } catch (error) {
    next(error);
  }
};

// DELETE /admin/bulk-deals/:id
exports.deleteBulkDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await BulkDeal.findByIdAndDelete(id);
    if (!deal) {
      return res.status(404).json({ message: 'Bulk deal not found' });
    }
    res.json({ message: 'Bulk deal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
