import express from 'express';
import multer from 'multer';
import { uploadReport, getReports } from '../controllers/report.controller.js';

const router = express.Router();

// Setup multer for file upload
// We use memoryStorage to hold the file in a buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate file format [cite: 11]
    if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only XML files are allowed.'), false);
    }
  },
});

// POST /api/reports/upload
router.post('/upload', upload.single('file'), uploadReport);

// GET /api/reports
router.get('/', getReports);

export default router;