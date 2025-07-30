const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    generateBudgetPlan,
    getCurrentBudgetPlan,
    getBudgetPlanHistory,
    compareWithActualSpending,
    getBudgetInsights
} = require('../controllers/aiBudgetPlannerController');

// Apply authentication middleware to all routes
router.use(protect);

// Generate AI budget plan
router.post('/generate', generateBudgetPlan);

// Get current budget plan
router.get('/current', getCurrentBudgetPlan);

// Get budget plan history
router.get('/history', getBudgetPlanHistory);

// Compare actual spending with budget plan
router.get('/compare', compareWithActualSpending);

// Get budget insights and recommendations
router.get('/insights', getBudgetInsights);

module.exports = router; 