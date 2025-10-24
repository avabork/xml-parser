import express from 'express';
import multer from 'multer';
import { uploadReport, getReports, deleteReport } from '../controllers/report.controller.js'; // Import deleteReport

const router = express.Router();

// Setup multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate file format
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

// DELETE /api/reports/:id
router.delete('/:id', deleteReport); // <-- ADD THIS NEW ROUTE

export default router;