const mongoose = require('mongoose');
const Property = require('../models/Property');
const { PROPERTY_TYPES, LISTING_TYPES, PROPERTY_STATUSES } = require('../models/Property');

const SLUG_FALLBACK = 'property';

function slugify(value) {
  const raw = String(value || '').toLowerCase().trim();
  const slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || SLUG_FALLBACK;
}

async function uniqueSlug(baseTitle, excludeId) {
  const base = slugify(baseTitle);
  let candidate = base;
  let suffix = 0;

  while (true) {
    const filter = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Property.findOne(filter).select('_id');
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function sanitizeGallery(gallery) {
  if (!Array.isArray(gallery)) return [];
  return gallery
    .filter((item) => item && item.url)
    .map((item) => ({
      url: String(item.url),
      s3Key: item.s3Key ? String(item.s3Key) : '',
      caption: item.caption ? String(item.caption) : ''
    }));
}

function buildPropertyPayload(body, slug) {
  return {
    title: body.title,
    slug,
    tagline: body.tagline || '',
    description: body.description || '',
    propertyType: PROPERTY_TYPES.includes(body.propertyType) ? body.propertyType : 'RESIDENTIAL_PLOT',
    listingType: LISTING_TYPES.includes(body.listingType) ? body.listingType : 'SALE',
    projectId: body.projectId && isValidObjectId(body.projectId) ? body.projectId : null,
    location: body.location || '',
    city: body.city || '',
    state: body.state || '',
    area: body.area || '',
    address: body.address || '',
    village: body.village || '',
    surveyNumber: body.surveyNumber || '',
    price: Number(body.price) || 0,
    pricePerSqft: Number(body.pricePerSqft) || 0,
    priceRange: body.priceRange || '',
    areaSqft: Number(body.areaSqft) || 0,
    areaSqYrd: Number(body.areaSqYrd) || 0,
    dimensions: body.dimensions || '',
    bedrooms: Number(body.bedrooms) || 0,
    bathrooms: Number(body.bathrooms) || 0,
    parkingSpaces: Number(body.parkingSpaces) || 0,
    highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : [],
    amenities: Array.isArray(body.amenities) ? body.amenities.filter(Boolean) : [],
    features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
    heroImage: body.heroImage || '',
    gallery: sanitizeGallery(body.gallery),
    floorPlanUrl: body.floorPlanUrl || '',
    brochureUrl: body.brochureUrl || '',
    videoUrl: body.videoUrl || '',
    googleMapsUrl: body.googleMapsUrl || '',
    mapEmbedUrl: body.mapEmbedUrl || '',
    contactPhone: body.contactPhone || '',
    contactEmail: body.contactEmail || '',
    status: PROPERTY_STATUSES.includes(body.status) ? body.status : 'AVAILABLE',
    isFeatured: Boolean(body.isFeatured),
    isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
    legalInfo: {
      reraNumber: body.legalInfo?.reraNumber || body.reraNumber || '',
      titleType: body.legalInfo?.titleType || body.titleType || 'Freehold',
      approvalAuthority: body.legalInfo?.approvalAuthority || body.approvalAuthority || ''
    }
  };
}

exports.getProperties = async (req, res, next) => {
  try {
    const { projectId, propertyType, status, search } = req.query;
    const filter = {};

    if (projectId && isValidObjectId(projectId)) filter.projectId = projectId;
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(filter)
      .populate('projectId', 'name code location city')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate('projectId', 'name code location city bannerImage');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    next(error);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Property title is required' });

    const slug = await uniqueSlug(req.body.slug || title);
    const payload = buildPropertyPayload(req.body, slug);
    if (req.user) payload.createdBy = req.user._id;

    const property = await Property.create(payload);
    const populated = await Property.findById(property._id).populate('projectId', 'name code location');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await Property.findById(id);
    if (!existing) return res.status(404).json({ message: 'Property not found' });

    const nextTitle = req.body.title || existing.title;
    const slug = req.body.slug && req.body.slug !== existing.slug
      ? await uniqueSlug(req.body.slug, existing._id)
      : existing.slug;

    const payload = buildPropertyPayload({ ...existing.toObject(), ...req.body, title: nextTitle }, slug);
    const property = await Property.findByIdAndUpdate(id, payload, { new: true })
      .populate('projectId', 'name code location');

    res.json(property);
  } catch (error) {
    next(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getPublicProperties = async (req, res, next) => {
  try {
    const { projectId, propertyType, city, featured } = req.query;
    const filter = { isPublished: { $ne: false } };

    if (projectId && isValidObjectId(projectId)) filter.projectId = projectId;
    if (propertyType) filter.propertyType = propertyType;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;

    const properties = await Property.find(filter)
      .populate('projectId', 'name code location city bannerImage')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.json(properties);
  } catch (error) {
    next(error);
  }
};

exports.getPublicPropertyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const filter = isValidObjectId(slug)
      ? { $or: [{ _id: slug }, { slug }] }
      : { slug };

    const property = await Property.findOne({ ...filter, isPublished: { $ne: false } })
      .populate('projectId', 'name code location city bannerImage mapImageUrl');

    if (!property) return res.status(404).json({ message: 'Property not found' });

    const similar = await Property.find({
      _id: { $ne: property._id },
      isPublished: { $ne: false },
      $or: [
        { propertyType: property.propertyType },
        { city: property.city },
        { projectId: property.projectId }
      ]
    })
      .limit(4)
      .sort({ isFeatured: -1, createdAt: -1 });

    res.json({ property, similar });
  } catch (error) {
    next(error);
  }
};

exports.getPublicGallery = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const items = [];

    const projects = await Project.find({ status: { $ne: 'DELETED' } })
      .select('name bannerImage mapImageUrl gallery')
      .lean();

    projects.forEach((project) => {
      if (project.bannerImage) {
        items.push({
          url: project.bannerImage,
          caption: project.name,
          sourceType: 'PROJECT',
          sourceId: project._id,
          sourceName: project.name
        });
      }
      if (project.mapImageUrl && project.mapImageUrl !== project.bannerImage) {
        items.push({
          url: project.mapImageUrl,
          caption: `${project.name} Layout`,
          sourceType: 'PROJECT',
          sourceId: project._id,
          sourceName: project.name
        });
      }
      (project.gallery || []).forEach((img) => {
        if (img.url) {
          items.push({
            url: img.url,
            caption: img.caption || project.name,
            sourceType: 'PROJECT',
            sourceId: project._id,
            sourceName: project.name
          });
        }
      });
    });

    const properties = await Property.find({ isPublished: { $ne: false } })
      .select('title heroImage gallery')
      .lean();

    properties.forEach((property) => {
      if (property.heroImage) {
        items.push({
          url: property.heroImage,
          caption: property.title,
          sourceType: 'PROPERTY',
          sourceId: property._id,
          sourceName: property.title
        });
      }
      (property.gallery || []).forEach((img) => {
        if (img.url) {
          items.push({
            url: img.url,
            caption: img.caption || property.title,
            sourceType: 'PROPERTY',
            sourceId: property._id,
            sourceName: property.title
          });
        }
      });
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
};
