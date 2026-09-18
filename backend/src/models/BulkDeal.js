const mongoose = require('mongoose');

const bulkDealSchema = new mongoose.Schema({
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
  dealType: {
    type: String,
    enum: ['PROJECT', 'PROPERTY', 'PACKAGE'],
    default: 'PROJECT'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
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
  originalPriceDisplay: {
    type: String,
    default: ''
  },
  bulkPriceDisplay: {
    type: String,
    default: ''
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  minQuantity: {
    type: String,
    default: '5 Plots'
  },
  totalPackageUnits: {
    type: String,
    default: '10 Packages Available'
  },
  perks: [{
    type: String
  }],
  bannerImage: {
    type: String,
    default: ''
  },
  bannerImageS3Key: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  validTill: {
    type: Date
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

bulkDealSchema.index({ isAvailable: 1, isFeatured: 1, order: 1 });

module.exports = mongoose.model('BulkDeal', bulkDealSchema);
