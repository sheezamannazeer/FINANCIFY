const aiBudgetPlannerService = require('../services/aiBudgetPlannerService');

// Generate AI budget plan
const generateBudgetPlan = async (req, res) => {
    try {
        const userId = req.user._id;
        const { totalBudget, requirements } = req.body;

        if (!totalBudget || !requirements) {
            return res.status(400).json({
                success: false,
                message: 'Total budget and requirements are required'
            });
        }

        const budgetPlan = await aiBudgetPlannerService.generateBudgetPlan(
            userId, 
            Number(totalBudget), 
            requirements
        );

        res.json({
            success: true,
            data: budgetPlan
        });
    } catch (error) {
        console.error('Error generating budget plan:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate budget plan'
        });
    }
};

// Get current budget plan
const getCurrentBudgetPlan = async (req, res) => {
    try {
        const userId = req.user._id;
        const budgetPlan = await aiBudgetPlannerService.getCurrentBudgetPlan(userId);

        res.json({
            success: true,
            data: budgetPlan
        });
    } catch (error) {
        console.error('Error getting current budget plan:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get budget plan'
        });
    }
};

// Get budget plan history
const getBudgetPlanHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await aiBudgetPlannerService.getBudgetPlanHistory(userId);

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error getting budget plan history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get budget plan history'
        });
    }
};

// Compare actual spending with budget plan
const compareWithActualSpending = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month } = req.query;

        const comparison = await aiBudgetPlannerService.compareWithActualSpending(userId, month);

        res.json({
            success: true,
            data: comparison
        });
    } catch (error) {
        console.error('Error comparing with actual spending:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to compare spending with budget'
        });
    }
};

// Get budget insights and recommendations
const getBudgetInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const comparison = await aiBudgetPlannerService.compareWithActualSpending(userId);
        
        if (!comparison) {
            return res.json({
                success: true,
                data: {
                    insights: [],
                    recommendations: []
                }
            });
        }

        const insights = [];
        const recommendations = [];

        // Generate insights based on comparison
        comparison.categories.forEach(category => {
            const safeCategoryName = category.name || (category._doc && category._doc.name) || 'this category';
            console.log('DEBUG: category in insights:', category, 'safeCategoryName:', safeCategoryName);
            if (category.status === 'over') {
                insights.push({
                    type: 'over_budget',
                    category: safeCategoryName,
                    message: `You've exceeded your ${safeCategoryName} budget by ₹${Math.abs(category.difference).toLocaleString()}`,
                    severity: 'high'
                });
                recommendations.push({
                    type: 'reduce_spending',
                    category: safeCategoryName,
                    message: `Consider reducing ${safeCategoryName} spending by ${Math.abs(category.difference).toFixed(0)}%`,
                    priority: 'high'
                });
            } else if (category.status === 'warning') {
                insights.push({
                    type: 'approaching_limit',
                    category: safeCategoryName,
                    message: `You're approaching your ${safeCategoryName} budget limit (${category.percentageUsed.toFixed(1)}% used)`,
                    severity: 'medium'
                });
            } else if (category.percentageUsed < 70) {
                insights.push({
                    type: 'under_budget',
                    category: safeCategoryName,
                    message: `Great job! You're under budget for ${safeCategoryName} (${category.percentageUsed.toFixed(1)}% used)`,
                    severity: 'low'
                });
            }
        });

        // Overall budget insights
        const totalBudgeted = comparison.totalBudgeted;
        const totalActual = comparison.totalActual;
        const overallPercentage = (totalActual / totalBudgeted) * 100;

        if (overallPercentage > 100) {
            insights.push({
                type: 'overall_over_budget',
                message: `You've exceeded your overall monthly budget by ₹${(totalActual - totalBudgeted).toLocaleString()}`,
                severity: 'high'
            });
            recommendations.push({
                type: 'overall_reduction',
                message: 'Review your spending and identify areas to cut back',
                priority: 'high'
            });
        } else if (overallPercentage < 80) {
            insights.push({
                type: 'overall_under_budget',
                message: `Great job! You're under your overall budget by ₹${(totalBudgeted - totalActual).toLocaleString()}`,
                severity: 'low'
            });
            recommendations.push({
                type: 'increase_savings',
                message: 'Consider increasing your savings with the extra money',
                priority: 'medium'
            });
        }

        res.json({
            success: true,
            data: {
                insights,
                recommendations,
                summary: {
                    totalBudgeted,
                    totalActual,
                    percentageUsed: overallPercentage,
                    status: comparison.overallStatus
                }
            }
        });
    } catch (error) {
        console.error('Error getting budget insights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get budget insights'
        });
    }
};

module.exports = {
    generateBudgetPlan,
    getCurrentBudgetPlan,
    getBudgetPlanHistory,
    compareWithActualSpending,
    getBudgetInsights
}; 