const express = require('express');
const router = express.Router();
const {
  getJournals,
  searchJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  uploadImage,
} = require('../controllers/journal.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// Apply auth protection to all journal routes
router.use(protect);

router.get('/', getJournals);
router.get('/search', searchJournals);
router.get('/:id', getJournalById);
router.post('/', createJournal);
router.put('/:id', updateJournal);
router.delete('/:id', deleteJournal);

// Route for image uploads
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
