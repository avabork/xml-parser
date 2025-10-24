import Report from '../models/report.model.js';
import { parseCreditReportXML } from '../utils/xmlParser.js';

/**
 * @desc    Upload & process XML file
 * @route   POST /api/reports/upload
 * @access  Public
 */
export const uploadReport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Convert buffer to string
    const xmlString = req.file.buffer.toString('utf-8');

    // Parse the XML string [cite: 14]
    const extractedData = await parseCreditReportXML(xmlString);

    // Add filename to the data
    extractedData.fileName = req.file.originalname;

    // Save to MongoDB 
    const report = new Report(extractedData);
    await report.save();

    res.status(201).json({
      message: 'File processed and report saved successfully.',
      data: report,
    });
  } catch (error) {
    // Handle parsing or validation errors [cite: 46]
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error processing file.', error: error.message });
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/reports
 * @access  Public
 */
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ message: 'Error fetching reports.', error: error.message });
  }
};