const GalleryItem = require('../models/GalleryItem');

// Public route: Get only published gallery items uploaded via Gallery Management
exports.getPublicGallery = async (req, res, next) => {
  try {
    const items = await GalleryItem.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Admin route: Get all gallery items
exports.getAdminGallery = async (req, res, next) => {
  try {
    const items = await GalleryItem.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Admin route: Create gallery item
exports.createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, imageUrl, imageS3Key, caption, order, isPublished } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and image URL are required' });
    }

    const payload = {
      title: String(title).trim(),
      category: category || 'PROJECT_SHOWCASE',
      imageUrl: String(imageUrl).trim(),
      imageS3Key: imageS3Key ? String(imageS3Key).trim() : '',
      caption: caption ? String(caption).trim() : '',
      order: Number(order) || 0,
      isPublished: isPublished === undefined ? true : Boolean(isPublished),
      createdBy: req.user ? req.user._id : null
    };

    const item = await GalleryItem.create(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Admin route: Update gallery item
exports.updateGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, imageUrl, imageS3Key, caption, order, isPublished } = req.body;

    const existing = await GalleryItem.findById(id);
    if (!existing) return res.status(404).json({ message: 'Gallery item not found' });

    const updates = {
      title: title !== undefined ? String(title).trim() : existing.title,
      category: category || existing.category,
      imageUrl: imageUrl !== undefined ? String(imageUrl).trim() : existing.imageUrl,
      imageS3Key: imageS3Key !== undefined ? String(imageS3Key).trim() : existing.imageS3Key,
      caption: caption !== undefined ? String(caption).trim() : existing.caption,
      order: order !== undefined ? Number(order) : existing.order,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished
    };

    const updated = await GalleryItem.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Admin route: Delete gallery item
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
