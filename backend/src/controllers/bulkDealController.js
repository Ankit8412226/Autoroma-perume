const mongoose = require('mongoose');
const BulkDeal = require('../models/BulkDeal');
const BulkBuyInquiry = require('../models/BulkBuyInquiry');
const Project = require('../models/Project');
const Property = require('../models/Property');
const { notifyAdmins } = require('../services/notificationService');

function cleanObjectId(id) {
  if (!id) return null;
  const str = String(id).trim();
  return mongoose.Types.ObjectId.isValid(str) ? str : null;
}

function parseValidDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function slugify(text) {
  const raw = String(text || '').toLowerCase().trim();
  let slug = raw
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

  if (!slug || slug.length < 2) {
    slug = `deal-${Date.now()}`;
  }
  return slug;
}

// GET /public/bulk-deals
exports.getPublicBulkDeals = async (req, res, next) => {
  try {
    const { search, city, state, dealType, minDiscount, sort } = req.query;
    const filter = { isAvailable: true };

    if (dealType && dealType !== 'ALL') {
      filter.dealType = dealType;
    }

    if (city && city !== 'All Cities' && city !== 'ALL') {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (state) {
      filter.state = { $regex: state, $options: 'i' };
    }

    if (minDiscount && !isNaN(Number(minDiscount))) {
      filter.discountPercentage = { $gte: Number(minDiscount) };
    }

    if (search && String(search).trim()) {
      const q = String(search).trim();
      const searchRegex = { $regex: q, $options: 'i' };
      const searchOr = [
        { title: searchRegex },
        { location: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { surveyNumber: searchRegex },
        { finalPlotNo: searchRegex },
        { tpSectorVillage: searchRegex },
        { landPlotType: searchRegex },
        { description: searchRegex },
        { originalPriceDisplay: searchRegex },
        { bulkPriceDisplay: searchRegex }
      ];

      if (filter.city) {
        filter.$and = filter.$and || [];
        filter.$and.push({ $or: searchOr });
      } else {
        filter.$or = searchOr;
      }
    }

    let sortOption = { isFeatured: -1, order: 1, createdAt: -1 };
    if (sort === 'DISCOUNT') sortOption = { discountPercentage: -1, createdAt: -1 };
    else if (sort === 'NEWEST') sortOption = { createdAt: -1 };

    const deals = await BulkDeal.find(filter)
      .populate('projectId', 'name code city location bannerImage priceRange')
      .populate('propertyId', 'title slug city area heroImage priceRange')
      .sort(sortOption);

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
      state,
      message
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone number are required' });
    }

    let resolvedTitle = dealTitle || '';
    if (bulkDealId && cleanObjectId(bulkDealId)) {
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
      state: String(state || '').trim(),
      propertyTitle: resolvedTitle || 'Bulk Deal Inquiry',
      message: String(message || '').trim(),
      status: 'NEW',
      source: 'BULK_DEALS_PAGE'
    });

    // Fire-and-forget admin notification
    notifyAdmins({
      title: `New Bulk Deal Request — ${String(name).trim()}`,
      message: `${String(phone).trim()} · ${resolvedTitle || 'General Bulk Deal'} · ${Number(unitCount) || 5} units${city ? ` · ${city}` : ''}${state ? `, ${state}` : ''}`,
      category: 'BULK_DEAL',
      meta: { inquiryId: inquiry._id, name, phone, email, propertyTitle: resolvedTitle, unitCount, city, state }
    });

    res.status(201).json({
      message: 'Bulk deal quote request submitted successfully. Our investment desk will get in touch shortly.',
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
      surveyNumber,
      finalPlotNo,
      areaSize,
      roadWidth,
      tpSectorVillage,
      landPlotType,
      isCorner,
      unitType,
      zone,
      naStatus,
      conditionTime,
      ratePerUnit,
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

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Title is required to create a bulk deal' });
    }

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await BulkDeal.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const cleanProject = cleanObjectId(projectId);
    const cleanProperty = cleanObjectId(propertyId);

    const newDeal = await BulkDeal.create({
      title: String(title).trim(),
      slug,
      dealType: ['PROJECT', 'PROPERTY', 'PACKAGE'].includes(dealType) ? dealType : 'PROJECT',
      projectId: cleanProject,
      propertyId: cleanProperty,
      location: String(location || '').trim(),
      city: String(city || '').trim(),
      state: String(state || '').trim(),
      surveyNumber: String(surveyNumber || '').trim(),
      finalPlotNo: String(finalPlotNo || '').trim(),
      areaSize: String(areaSize || '').trim(),
      roadWidth: String(roadWidth || '').trim(),
      tpSectorVillage: String(tpSectorVillage || '').trim(),
      landPlotType: String(landPlotType || 'Land').trim(),
      isCorner: String(isCorner || 'Corner').trim(),
      unitType: String(unitType || 'SQYD').trim(),
      zone: String(zone || 'HAC').trim(),
      naStatus: String(naStatus || 'READY').trim(),
      conditionTime: String(conditionTime || '3 MONTHS').trim(),
      ratePerUnit: String(ratePerUnit || '').trim(),
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
      validTill: parseValidDate(validTill),
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
    if (!cleanObjectId(id)) {
      return res.status(400).json({ message: 'Invalid Bulk Deal ID' });
    }

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
      surveyNumber,
      finalPlotNo,
      areaSize,
      roadWidth,
      tpSectorVillage,
      landPlotType,
      isCorner,
      unitType,
      zone,
      naStatus,
      conditionTime,
      ratePerUnit,
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

    if (title && String(title).trim() !== deal.title) {
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

    if (dealType !== undefined) deal.dealType = ['PROJECT', 'PROPERTY', 'PACKAGE'].includes(dealType) ? dealType : deal.dealType;
    if (projectId !== undefined) deal.projectId = cleanObjectId(projectId);
    if (propertyId !== undefined) deal.propertyId = cleanObjectId(propertyId);
    if (location !== undefined) deal.location = String(location).trim();
    if (city !== undefined) deal.city = String(city).trim();
    if (state !== undefined) deal.state = String(state).trim();
    if (surveyNumber !== undefined) deal.surveyNumber = String(surveyNumber).trim();
    if (finalPlotNo !== undefined) deal.finalPlotNo = String(finalPlotNo).trim();
    if (areaSize !== undefined) deal.areaSize = String(areaSize).trim();
    if (roadWidth !== undefined) deal.roadWidth = String(roadWidth).trim();
    if (tpSectorVillage !== undefined) deal.tpSectorVillage = String(tpSectorVillage).trim();
    if (landPlotType !== undefined) deal.landPlotType = String(landPlotType).trim();
    if (isCorner !== undefined) deal.isCorner = String(isCorner).trim();
    if (unitType !== undefined) deal.unitType = String(unitType).trim();
    if (zone !== undefined) deal.zone = String(zone).trim();
    if (naStatus !== undefined) deal.naStatus = String(naStatus).trim();
    if (conditionTime !== undefined) deal.conditionTime = String(conditionTime).trim();
    if (ratePerUnit !== undefined) deal.ratePerUnit = String(ratePerUnit).trim();
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
    if (validTill !== undefined) deal.validTill = parseValidDate(validTill);
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
    if (!cleanObjectId(id)) {
      return res.status(400).json({ message: 'Invalid Bulk Deal ID' });
    }
    const deal = await BulkDeal.findByIdAndDelete(id);
    if (!deal) {
      return res.status(404).json({ message: 'Bulk deal not found' });
    }
    res.json({ message: 'Bulk deal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
