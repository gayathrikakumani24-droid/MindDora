const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'minddora_journals',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
  });
} else {
  // Ensure local uploads directory exists
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(
        null,
        file.fieldname +
          '-' +
          uniqueSuffix +
          path.extname(file.originalname)
      );
    },
  });
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

module.exports = { upload };
