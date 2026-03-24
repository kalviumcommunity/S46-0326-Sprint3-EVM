const express = require('express');
const router = express.Router();
const {
  createElection,
  getAllElections,
  getElectionById,
  startElection,
  endElection,
  getElectionResults,
} = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllElections);
router.get('/:id', getElectionById);
router.get('/:id/results', getElectionResults);

// Protected routes (Admin only)
router.post('/create', protect, adminOnly, createElection);
router.put('/:id/start', protect, adminOnly, startElection);
router.put('/:id/end', protect, adminOnly, endElection);

module.exports = router;
