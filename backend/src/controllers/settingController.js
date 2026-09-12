const SystemSetting = require('../models/SystemSetting');

const DEFAULT_ANNOUNCEMENT = 'महत्वपूर्ण सूचना: धोलरा SIR एवं नोएडा स्मार्ट सिटी टाउनशिप में नए प्लॉट्स की रजिस्ट्री चालू है। साइट विज़िट बुक करने के लिए संपर्क करें: +91 93112 27789 | व्हाट्सएप: +91 92899 27527';

// 1. Get Announcement Ticker (Public)
exports.getAnnouncement = async (req, res, next) => {
  try {
    let setting = await SystemSetting.findOne({ key: 'ANNOUNCEMENT_TICKER' });
    if (!setting) {
      setting = await SystemSetting.create({
        key: 'ANNOUNCEMENT_TICKER',
        value: DEFAULT_ANNOUNCEMENT,
        isActive: true
      });
    }
    res.json({
      announcement: setting.value || DEFAULT_ANNOUNCEMENT,
      isActive: setting.isActive !== false
    });
  } catch (error) {
    next(error);
  }
};

// 2. Update Announcement Ticker (Admin / Manager Protected)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { value, isActive } = req.body;
    let setting = await SystemSetting.findOne({ key: 'ANNOUNCEMENT_TICKER' });

    if (!setting) {
      setting = new SystemSetting({ key: 'ANNOUNCEMENT_TICKER' });
    }

    if (value !== undefined) setting.value = value;
    if (isActive !== undefined) setting.isActive = isActive;

    await setting.save();

    res.json({
      message: 'Announcement ticker updated successfully',
      announcement: setting.value,
      isActive: setting.isActive
    });
  } catch (error) {
    next(error);
  }
};
