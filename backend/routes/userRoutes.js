const express = require('express');
const {
  createLead,
  getLeads,
  updateLeadStatus,
  addNote,
  getAnalytics,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createLead);
router.get('/', protect, getLeads);
router.get('/analytics', protect, getAnalytics);
router.put('/:id/status', protect, updateLeadStatus);
router.post('/:id/notes', protect, addNote);
// Update lead details
router.put('/:id', protect, updateLead);

// Delete lead
router.delete('/:id', protect, deleteLead);

module.exports = router;