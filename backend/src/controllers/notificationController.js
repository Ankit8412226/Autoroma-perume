const Notification = require('../models/Notification');


exports.getNotifications = async (req, res, next) => {
  try {
    const { category, status, limit = 100 } = req.query;

    const filter = {
      $or: [
        { userId: null },             // broadcast admin notifications
        { userId: req.user._id }      // personal notifications for this user
      ]
    };

    if (category) filter.category = category;
    if (status) filter.status = status;

    const notifications = await Notification.find(filter)
      .populate('userId', 'fullName email')
      .sort({ sentAt: -1 })
      .limit(Number(limit) || 100);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /notifications/unread-count
 * Returns the count of unread notifications for badge display.
 */
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      $or: [{ userId: null }, { userId: req.user._id }],
      status: 'UNREAD'
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /notifications/:id/read
 * Mark a single notification as READ.
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    notif.status = 'READ';
    await notif.save();
    res.json(notif);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /notifications/mark-all-read
 * Mark ALL unread notifications for this admin as READ.
 */
exports.markAllRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      {
        $or: [{ userId: null }, { userId: req.user._id }],
        status: 'UNREAD'
      },
      { $set: { status: 'READ' } }
    );
    res.json({ message: 'All notifications marked as read', updatedCount: result.modifiedCount });
  } catch (error) {
    next(error);
  }
};
