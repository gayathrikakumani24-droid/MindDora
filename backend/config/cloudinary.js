const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_API_SECRET.includes('*') &&
  !process.env.CLOUDINARY_API_SECRET.startsWith('your_')
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('Cloudinary not configured or contains placeholder credentials. Fallback local disk storage will be used for file uploads.');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};

