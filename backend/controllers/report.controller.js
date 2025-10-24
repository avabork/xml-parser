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

    // Parse the XML string
    const parsedData = await parseCreditReportXML(xmlString);

    let reportToSave;

    // Check if the parser marked this as a generic file
    if (parsedData.isGeneric) {
      reportToSave = new Report({
        fileName: req.file.originalname,
        genericData: parsedData.genericData,
      });
    } else {
      // This is an Experian file, save all extracted data
      parsedData.fileName = req.file.originalname;
      reportToSave = new Report(parsedData);
    }

    // Save to MongoDB
    const savedReport = await reportToSave.save();

    res.status(201).json({
      message: 'File processed and report saved successfully.',
      data: savedReport,
    });
  } catch (error) {
    // Handle parsing or validation errors
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

/**
 * @desc    Delete a report by ID
 * @route   DELETE /api/reports/:id
 * @access  Public
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.deleteOne(); // Use deleteOne() on the document

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
};