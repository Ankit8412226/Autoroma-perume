const express = require('express');
const router = express.Router();
const multer = require('multer');

const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const mlmController = require('../controllers/mlmController');
const projectController = require('../controllers/projectController');
const plotController = require('../controllers/plotController');
const plotMapController = require('../controllers/plotMapController');
const ocrController = require('../controllers/ocrController');
const commissionController = require('../controllers/commissionController');
const payoutController = require('../controllers/payoutController');
const kycController = require('../controllers/kycController');
const dashboardController = require('../controllers/dashboardController');
const notificationController = require('../controllers/notificationController');
const reportController = require('../controllers/reportController');

const inquiryController = require('../controllers/inquiryController');
const bulkBuyController = require('../controllers/bulkBuyController');
const BulkBuyInquiry = require('../models/BulkBuyInquiry');
const uploadController = require('../controllers/uploadController');
const propertyController = require('../controllers/propertyController');
const settingController = require('../controllers/settingController');

const { protect, authorize } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const { validate } = require('../middleware/validate');

const upload = multer({ storage: multer.memoryStorage() });

const ROLES = ['ADMIN', 'MANAGER', 'EMPLOYEE', 'AGENT', 'DIRECTOR'];
const PLOT_STATUSES = ['AVAILABLE', 'BOOKED', 'PENDING', 'SOLD'];
const PROPERTY_TYPES = ['RESIDENTIAL_PLOT', 'COMMERCIAL', 'VILLA', 'SHOWROOM', 'APARTMENT', 'LAND'];
const LISTING_TYPES = ['SALE', 'RENT'];
const PROPERTY_STATUSES = ['AVAILABLE', 'BOOKED', 'SOLD', 'UPCOMING'];

// Rate limiters for public submissions
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many attempts, please try again later.' });
const inquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many inquiries submitted. Please wait a few minutes before trying again.' });

// --- S3 UPLOAD ROUTES ---
router.post('/upload', protect, upload.single('file'), uploadController.uploadFile);
router.post('/public/upload', upload.single('file'), uploadController.uploadFile);

// --- PUBLIC DISCOVERY & LANDING PAGE ROUTES (No Auth Required) ---
router.get('/public/projects', inquiryController.getPublicProjects);
router.get('/public/projects/:id', inquiryController.getPublicProjectById);
router.get('/public/plots', inquiryController.getPublicPlots);
router.get('/public/agents', inquiryController.getPublicAgents);
router.get('/public/agent-invite/:code', employeeController.getPublicInvite);
router.get('/public/locations', inquiryController.getPublicLocations);
router.get('/public/properties', propertyController.getPublicProperties);
router.get('/public/properties/:slug', propertyController.getPublicPropertyBySlug);
router.get('/public/gallery', propertyController.getPublicGallery);
router.get('/public/announcement', settingController.getAnnouncement);
router.put('/admin/announcement', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), settingController.updateAnnouncement);

router.post('/public/inquiries', inquiryLimiter, validate({
  name: { required: true, type: 'string', minLength: 2, maxLength: 80 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'string', minLength: 5, maxLength: 20 }
}), inquiryController.createPublicInquiry);
router.post('/public/bulk-buy', inquiryLimiter, validate({
  name: { required: true, type: 'string', minLength: 2, maxLength: 80 },
  phone: { required: true, type: 'string', minLength: 5, maxLength: 20 },
  email: { type: 'email' },
  unitCount: { type: 'number', min: BulkBuyInquiry.MIN_BULK_UNITS, max: BulkBuyInquiry.MAX_BULK_UNITS }
}), bulkBuyController.createPublicBulkBuy);
router.post('/public/agent-application', inquiryLimiter, validate({
  fullName: { required: true, type: 'string', minLength: 2, maxLength: 80 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'string', minLength: 5, maxLength: 20 }
}), inquiryController.createPublicAgentApplication);

// --- Auth Routes ---
router.post('/auth/register', authLimiter, validate({
  fullName: { required: true, type: 'string', minLength: 2, maxLength: 80 },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 6, maxLength: 128 },
  phone: { type: 'string', maxLength: 20 }
}), authController.register);
router.post('/auth/login', authLimiter, validate({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string' }
}), authController.login);
router.post('/auth/forgot-password', authLimiter, validate({
  email: { required: true, type: 'email' }
}), authController.forgotPassword);
router.post('/auth/reset-password', authLimiter, validate({
  resetToken: { required: true, type: 'string' },
  newPassword: { required: true, type: 'string', minLength: 6 }
}), authController.resetPassword);
router.get('/auth/me', protect, authController.getMe);

router.post('/auth/register-public-agent', authLimiter, validate({
  fullName: { required: true, type: 'string', minLength: 2, maxLength: 80 },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 6, maxLength: 128 },
  phone: { required: true, type: 'string', minLength: 5, maxLength: 20 }
}), authController.registerPublicAgent);

// --- Employee / Agent CRUD & MLM Routes ---
router.get('/employees/me/invite-link', protect, employeeController.getMyInviteLink);
router.get('/employees', protect, employeeController.getEmployees);
router.post('/employees', protect, validate({
  fullName: { required: true, type: 'string', minLength: 2, maxLength: 80 },
  email: { required: true, type: 'email' },
  phone: { type: 'string', maxLength: 20 },
  password: { type: 'string', minLength: 6, maxLength: 128 },
  role: { type: 'string', enum: ROLES },
  parentId: { type: 'objectId' }
}), employeeController.createEmployee);
router.get('/employees/:id', protect, employeeController.getEmployeeById);
router.put('/employees/:id', protect, validate({
  fullName: { type: 'string', minLength: 2, maxLength: 80 },
  phone: { type: 'string', maxLength: 20 },
  currentRank: { type: 'string' },
  parentId: { type: 'objectId' }
}), employeeController.updateEmployee);
router.delete('/employees/:id', protect, authorize('ADMIN'), employeeController.deleteEmployee);
router.post('/employees/:id/approve', protect, authorize('ADMIN', 'MANAGER', 'DIRECTOR'), employeeController.approveAgent);
router.post('/employees/:id/reject', protect, authorize('ADMIN', 'MANAGER', 'DIRECTOR'), employeeController.rejectAgent);
router.post('/employees/:id/evaluate-rank', protect, authorize('ADMIN', 'DIRECTOR'), employeeController.updateEmployeeRank);

router.get('/mlm/tree', protect, mlmController.getTree);
router.get('/mlm/rank-rules', protect, mlmController.getRankRules);
router.get('/mlm/summary', protect, authorize('ADMIN', 'DIRECTOR'), mlmController.getMLMSummary);
router.post('/mlm/evaluate-rank/:employeeId', protect, authorize('ADMIN', 'DIRECTOR'), mlmController.evaluateRank);

// --- Projects & Settings CRUD Routes ---
router.get('/projects', protect, projectController.getProjects);
router.post('/projects', protect, authorize('ADMIN', 'DIRECTOR'), validate({
  name: { required: true, type: 'string', minLength: 2, maxLength: 120 },
  code: { required: true, type: 'string', minLength: 2, maxLength: 30 },
  location: { required: true, type: 'string' },
  totalAreaSqft: { required: true, type: 'number', min: 0 },
  basePricePerSqft: { required: true, type: 'number', min: 0 }
}), projectController.createProject);
router.get('/projects/:id', protect, projectController.getProjectById);
router.put('/projects/:id', protect, authorize('ADMIN', 'DIRECTOR'), validate({
  name: { type: 'string', minLength: 2, maxLength: 120 },
  code: { type: 'string', minLength: 2, maxLength: 30 },
  totalAreaSqft: { type: 'number', min: 0 },
  basePricePerSqft: { type: 'number', min: 0 }
}), projectController.updateProject);
router.delete('/projects/:id', protect, authorize('ADMIN'), projectController.deleteProject);
router.put('/projects/:projectId/settings', protect, authorize('ADMIN'), projectController.updateProjectSettings);

// --- Property Listings (separate from township Projects) ---
router.get('/properties', protect, propertyController.getProperties);
router.post('/properties', protect, authorize('ADMIN', 'DIRECTOR'), validate({
  title: { required: true, type: 'string', minLength: 2, maxLength: 160 },
  propertyType: { type: 'string', enum: PROPERTY_TYPES },
  listingType: { type: 'string', enum: LISTING_TYPES },
  status: { type: 'string', enum: PROPERTY_STATUSES },
  price: { type: 'number', min: 0 },
  projectId: { type: 'objectId' }
}), propertyController.createProperty);
router.get('/properties/:id', protect, propertyController.getPropertyById);
router.put('/properties/:id', protect, authorize('ADMIN', 'DIRECTOR'), validate({
  title: { type: 'string', minLength: 2, maxLength: 160 },
  propertyType: { type: 'string', enum: PROPERTY_TYPES },
  listingType: { type: 'string', enum: LISTING_TYPES },
  status: { type: 'string', enum: PROPERTY_STATUSES },
  price: { type: 'number', min: 0 },
  projectId: { type: 'objectId' }
}), propertyController.updateProperty);
router.delete('/properties/:id', protect, authorize('ADMIN'), propertyController.deleteProperty);

// --- Plot Management & Sales Routes ---
router.get('/user/my-properties', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, plotController.getUserProperties);
router.get('/plots', protect, plotController.getPlots);
router.get('/plots/export-csv', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), plotController.exportPlotsCSV);
router.post('/plots/compute-price', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), plotController.computePricePreview);
router.post('/plots/import-csv', protect, authorize('ADMIN', 'DIRECTOR'), validate({
  projectId: { required: true, type: 'objectId' },
  plotsData: { required: true, type: 'array' }
}), plotController.importPlotsCSV);
router.get('/plots/:id', protect, plotController.getPlotById);
router.put('/plots/:id/marker', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), validate({
  xPercent: { required: true, type: 'number', min: 0, max: 100 },
  yPercent: { required: true, type: 'number', min: 0, max: 100 }
}), plotController.updatePlotMarker);
router.put('/plots/:id/status', protect, validate({
  status: { required: true, type: 'string', enum: PLOT_STATUSES },
  ownerEmail: { type: 'email' },
  // sellerEmployeeId intentionally excluded from objectId validation:
  // the controller accepts both a valid ObjectId (employee) and the
  // sentinel strings 'DIRECT' / 'NONE' (no-agent direct sale).
  paidAmount: { type: 'number', min: 0 }
}), plotController.updatePlotStatus);
router.post('/plots/:plotId/documents', protect, upload.single('file'), plotController.uploadPlotDocument);

// --- Plot Map & OCR Pipeline Routes ---
router.get('/plot-maps', protect, plotMapController.getPlotMaps);
router.get('/plot-maps/:id', protect, plotMapController.getPlotMapById);
router.post('/ocr/analyze', protect, authorize('ADMIN', 'DIRECTOR'), upload.single('file'), ocrController.analyzeMap);
router.post('/ocr/approve/:mapId', protect, authorize('ADMIN', 'DIRECTOR'), ocrController.approveMapOverlay);
router.post('/ocr/reject/:mapId', protect, authorize('ADMIN', 'DIRECTOR'), ocrController.rejectMapOverlay);

// --- Commission & Payout Routes ---
router.get('/commissions', protect, commissionController.getCommissions);
router.get('/commissions/summary', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), commissionController.getCommissionSummary);

router.get('/payouts', protect, payoutController.getPayouts);
router.post('/payouts/request', protect, validate({
  employeeId: { type: 'objectId' }
}), payoutController.requestPayout);
router.post('/payouts/:id/approve', protect, authorize('ADMIN', 'DIRECTOR'), payoutController.approvePayout);

// --- Agent KYC (required before payout) ---
router.get('/kyc/me', protect, kycController.getMyKyc);
router.put('/kyc/me', protect, kycController.saveMyKyc);
router.get('/kyc', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), kycController.listKyc);
router.get('/kyc/employee/:employeeId', protect, kycController.getKycByEmployee);
router.get('/kyc/:id', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), kycController.getKycById);
router.post('/kyc/:id/approve', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), kycController.approveKyc);
router.post('/kyc/:id/reject', protect, authorize('ADMIN', 'DIRECTOR', 'MANAGER'), kycController.rejectKyc);

// --- Reports (admin / director only) ---
router.get('/reports/commission-audit', protect, authorize('ADMIN', 'DIRECTOR'), reportController.commissionAuditReport);
router.get('/reports/revenue', protect, authorize('ADMIN', 'DIRECTOR'), reportController.revenueReport);
router.get('/reports/mlm-performance', protect, authorize('ADMIN', 'DIRECTOR'), reportController.mlmPerformanceReport);
router.get('/reports/payout-summary', protect, authorize('ADMIN', 'DIRECTOR'), reportController.payoutSummaryReport);
router.get('/reports/plot-ledger', protect, authorize('ADMIN', 'DIRECTOR'), reportController.plotLedgerReport);

// --- Inquiries & Customer Leads (Admin / Manager) ---
router.get('/inquiries', protect, authorize('ADMIN', 'MANAGER', 'DIRECTOR'), inquiryController.getInquiries);
router.put('/inquiries/:id/status', protect, authorize('ADMIN', 'MANAGER', 'DIRECTOR'), inquiryController.updateInquiryStatus);
router.get('/bulk-buy-inquiries', protect, authorize('ADMIN', 'MANAGER', 'DIRECTOR'), bulkBuyController.getBulkBuyInquiries);
router.put('/bulk-buy-inquiries/:id/status', protect, authorize('ADMIN', 'MANAGER', 'DIRECTOR'), bulkBuyController.updateBulkBuyStatus);

// --- Executive Dashboard & Notifications ---
router.get('/dashboard/stats', protect, authorize('ADMIN', 'DIRECTOR'), dashboardController.getDashboardStats);
router.get('/notifications', protect, notificationController.getNotifications);
router.put('/notifications/:id/read', protect, notificationController.markAsRead);

module.exports = router;
