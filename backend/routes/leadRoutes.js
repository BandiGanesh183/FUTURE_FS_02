const express = require('express');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
  updateLeadScore,
  addNote,
  getAnalytics
} = require('../controllers/leadController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createLead);

// Protected routes (authentication required)
router.get('/', protect, getLeads);
router.get('/analytics', protect, getAnalytics);
router.get('/:id', protect, getLeadById);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);
router.patch('/:id/status', protect, updateLeadStatus);
router.patch('/:id/score', protect, updateLeadScore);
router.post('/:id/notes', protect, addNote);
router.delete('/:id', protect, deleteLead);

module.exports = router;