const mongoose = require('mongoose');

const PROPERTY_TYPES = [
  'RESIDENTIAL_PLOT',
  'COMMERCIAL',
  'VILLA',
  'SHOWROOM',
  'APARTMENT',
  'LAND'
];

const LISTING_TYPES = ['SALE', 'RENT'];

const PROPERTY_STATUSES = ['AVAILABLE', 'BOOKED', 'SOLD', 'UPCOMING'];

const galleryItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  s3Key: { type: String, default: '' },
  caption: { type: String, default: '' }
}, { _id: false });

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  tagline: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  propertyType: {
    type: String,
    enum: PROPERTY_TYPES,
    default: 'RESIDENTIAL_PLOT'
  },
  listingType: {
    type: String,
    enum: LISTING_TYPES,
    default: 'SALE'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  location: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  village: {
    type: String,
    default: ''
  },
  surveyNumber: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  pricePerSqft: {
    type: Number,
    default: 0
  },
  priceRange: {
    type: String,
    default: ''
  },
  areaSqft: {
    type: Number,
    default: 0
  },
  areaSqYrd: {
    type: Number,
    default: 0
  },
  dimensions: {
    type: String,
    default: ''
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  parkingSpaces: {
    type: Number,
    default: 0
  },
  highlights: [{ type: String }],
  amenities: [{ type: String }],
  features: [{ type: String }],
  heroImage: {
    type: String,
    default: ''
  },
  gallery: [galleryItemSchema],
  floorPlanUrl: {
    type: String,
    default: ''
  },
  brochureUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  googleMapsUrl: {
    type: String,
    default: ''
  },
  mapEmbedUrl: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: PROPERTY_STATUSES,
    default: 'AVAILABLE'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  legalInfo: {
    reraNumber: { type: String, default: '' },
    titleType: { type: String, default: 'Freehold' },
    approvalAuthority: { type: String, default: '' }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

propertySchema.index({ propertyType: 1, status: 1, isPublished: 1 });
propertySchema.index({ projectId: 1 });
propertySchema.index({ city: 1 });

module.exports = mongoose.model('Property', propertySchema);
module.exports.PROPERTY_TYPES = PROPERTY_TYPES;
module.exports.LISTING_TYPES = LISTING_TYPES;
module.exports.PROPERTY_STATUSES = PROPERTY_STATUSES;
