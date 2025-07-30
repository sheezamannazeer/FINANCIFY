const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Expense = require('../models/Expense');
const moment = require('moment');

class AIBudgetPlannerService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    // Generate AI-powered budget allocation
    async generateBudgetPlan(userId, totalBudget, requirements) {
        try {
            // Get user's spending history for context
            const user = await User.findById(userId);
            const spendingHistory = await this.getSpendingHistory(userId);
            
            // Create prompt for Gemini
            const prompt = this.createBudgetPrompt(totalBudget, requirements, spendingHistory, user);
            
            // Get AI response
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const budgetPlan = this.parseAIResponse(response.text());
            
            // Save the budget plan
            await this.saveBudgetPlan(userId, budgetPlan, totalBudget);
            
            return budgetPlan;
        } catch (error) {
            console.error('Error generating budget plan:', error);
            throw new Error('Failed to generate budget plan');
        }
    }

    // Get user's spending history for context
    async getSpendingHistory(userId) {
        try {
            const threeMonthsAgo = moment().subtract(3, 'months').toDate();
            const expenses = await Expense.find({
                userId,
                date: { $gte: threeMonthsAgo }
            }).sort({ date: -1 });

            // Group by category and calculate averages
            const categoryTotals = {};
            const categoryCounts = {};
            
            expenses.forEach(expense => {
                const category = expense.category.toLowerCase();
                if (!categoryTotals[category]) {
                    categoryTotals[category] = 0;
                    categoryCounts[category] = 0;
                }
                categoryTotals[category] += expense.amount;
                categoryCounts[category] += 1;
            });

            const averages = {};
            Object.keys(categoryTotals).forEach(category => {
                averages[category] = categoryTotals[category] / categoryCounts[category];
            });

            return {
                totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
                categoryAverages: averages,
                recentExpenses: expenses.slice(0, 10).map(e => ({
                    category: e.category,
                    amount: e.amount,
                    date: e.date
                }))
            };
        } catch (error) {
            console.error('Error getting spending history:', error);
            return null;
        }
    }

    // Create intelligent prompt for Gemini
    createBudgetPrompt(totalBudget, requirements, spendingHistory, user) {
        const basePrompt = `You are an expert financial advisor and budget planner. Help create a detailed monthly budget allocation.

TOTAL BUDGET: ₹${totalBudget.toLocaleString()}

USER REQUIREMENTS: ${requirements}

${spendingHistory ? `SPENDING HISTORY (Last 3 months):
- Total spent: ₹${spendingHistory.totalExpenses.toLocaleString()}
- Average spending by category: ${Object.entries(spendingHistory.categoryAverages).map(([cat, avg]) => `${cat}: ₹${avg.toFixed(0)}`).join(', ')}
- Recent expenses: ${spendingHistory.recentExpenses.map(e => `${e.category}: ₹${e.amount}`).join(', ')}` : 'No spending history available.'}

TASK: Create a detailed budget allocation that:
1. Prioritizes essential expenses (rent, food, utilities)
2. Allocates reasonable amounts for discretionary spending
3. Includes savings/emergency fund
4. Considers the user's spending history and patterns
5. Provides specific amounts for each category
6. Includes helpful tips for each category

RESPONSE FORMAT (JSON only):
{
  "categories": [
    {
      "name": "Category Name",
      "allocated": 1000,
      "priority": "high|medium|low",
      "description": "What this covers",
      "tips": ["Tip 1", "Tip 2"],
      "percentage": 20
    }
  ],
  "summary": {
    "totalAllocated": 5000,
    "remaining": 0,
    "savingsRate": 10,
    "keyInsights": ["Insight 1", "Insight 2"]
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

IMPORTANT: 
- Ensure total allocated amount equals the total budget
- Include at least 10% for savings
- Prioritize rent, food, utilities, and transportation
- Be realistic and practical
- Provide specific, actionable tips`;

        return basePrompt;
    }

    // Parse AI response into structured data
    parseAIResponse(aiResponse) {
        try {
            // Extract JSON from the response
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid AI response format');
            }

            const budgetPlan = JSON.parse(jsonMatch[0]);
            
            // Validate the response
            if (!budgetPlan.categories || !budgetPlan.summary) {
                throw new Error('Invalid budget plan structure');
            }

            return budgetPlan;
        } catch (error) {
            console.error('Error parsing AI response:', error);
            // Return a fallback budget plan
            return this.createFallbackBudgetPlan();
        }
    }

    // Create fallback budget plan if AI fails
    createFallbackBudgetPlan() {
        return {
            categories: [
                {
                    name: "Rent/Housing",
                    allocated: 2000,
                    priority: "high",
                    description: "Monthly rent or mortgage payment",
                    tips: ["Try to keep housing costs under 30% of income", "Consider roommates to reduce costs"],
                    percentage: 40
                },
                {
                    name: "Food & Groceries",
                    allocated: 1000,
                    priority: "high",
                    description: "Daily meals and household groceries",
                    tips: ["Plan meals in advance", "Buy in bulk for non-perishables"],
                    percentage: 20
                },
                {
                    name: "Transportation",
                    allocated: 500,
                    priority: "high",
                    description: "Fuel, public transport, maintenance",
                    tips: ["Use public transport when possible", "Carpool to save fuel costs"],
                    percentage: 10
                },
                {
                    name: "Utilities",
                    allocated: 400,
                    priority: "high",
                    description: "Electricity, water, internet, phone",
                    tips: ["Turn off unused appliances", "Compare utility providers"],
                    percentage: 8
                },
                {
                    name: "Entertainment",
                    allocated: 300,
                    priority: "medium",
                    description: "Movies, dining out, hobbies",
                    tips: ["Look for free entertainment options", "Set limits on dining out"],
                    percentage: 6
                },
                {
                    name: "Healthcare",
                    allocated: 200,
                    priority: "high",
                    description: "Medical expenses, insurance",
                    tips: ["Maintain emergency medical fund", "Use generic medications when possible"],
                    percentage: 4
                },
                {
                    name: "Savings",
                    allocated: 600,
                    priority: "high",
                    description: "Emergency fund and future goals",
                    tips: ["Pay yourself first", "Automate savings transfers"],
                    percentage: 12
                }
            ],
            summary: {
                totalAllocated: 5000,
                remaining: 0,
                savingsRate: 12,
                keyInsights: [
                    "Your budget is well-balanced with 12% savings",
                    "Housing costs are within recommended 30-40% range",
                    "Consider tracking actual spending vs budget"
                ]
            },
            recommendations: [
                "Track your spending daily to stay within budget",
                "Review and adjust budget monthly based on actual expenses",
                "Build an emergency fund of 3-6 months expenses"
            ]
        };
    }

    // Save budget plan to user's profile
    async saveBudgetPlan(userId, budgetPlan, totalBudget) {
        try {
            const budgetData = {
                totalBudget,
                categories: budgetPlan.categories,
                summary: budgetPlan.summary,
                recommendations: budgetPlan.recommendations,
                createdAt: new Date(),
                month: moment().format('YYYY-MM')
            };

            await User.findByIdAndUpdate(userId, {
                $push: { budgetPlans: budgetData },
                $set: { 
                    monthlyBudget: totalBudget,
                    currentBudgetPlan: budgetData
                }
            });

            return budgetData;
        } catch (error) {
            console.error('Error saving budget plan:', error);
            throw error;
        }
    }

    // Get user's current budget plan
    async getCurrentBudgetPlan(userId) {
        try {
            const user = await User.findById(userId);
            return user.currentBudgetPlan || null;
        } catch (error) {
            console.error('Error getting current budget plan:', error);
            return null;
        }
    }

    // Get budget plan history
    async getBudgetPlanHistory(userId) {
        try {
            const user = await User.findById(userId);
            return user.budgetPlans || [];
        } catch (error) {
            console.error('Error getting budget plan history:', error);
            return [];
        }
    }

    // Compare actual spending with budget plan
    async compareWithActualSpending(userId, month = null) {
        try {
            const targetMonth = month || moment().format('YYYY-MM');
            const startDate = moment(targetMonth + '-01').startOf('month').toDate();
            const endDate = moment(targetMonth + '-01').endOf('month').toDate();

            const expenses = await Expense.find({
                userId,
                date: { $gte: startDate, $lte: endDate }
            });

            const user = await User.findById(userId);
            const budgetPlan = user.currentBudgetPlan;

            if (!budgetPlan) {
                return null;
            }

            // Calculate actual spending by category (case-insensitive, trimmed)
            const actualSpending = {};
            expenses.forEach(expense => {
                if (!expense.category) return; // skip if category is missing
                const category = expense.category.trim().toLowerCase();
                if (!actualSpending[category]) {
                    actualSpending[category] = 0;
                }
                actualSpending[category] += expense.amount;
            });

            // Compare with budget
            const comparison = budgetPlan.categories.map(budgetCategory => {
                const categoryName = (budgetCategory.name || '').trim().toLowerCase();
                const actual = actualSpending[categoryName] || 0;
                const budgeted = budgetCategory.allocated;
                const difference = actual - budgeted;
                const percentage = budgeted > 0 ? (actual / budgeted) * 100 : 0;

                return {
                    ...budgetCategory,
                    actualSpending: actual,
                    difference: difference,
                    percentageUsed: percentage,
                    status: percentage > 110 ? 'over' : percentage > 90 ? 'warning' : 'good'
                };
            });

            return {
                month: targetMonth,
                totalBudgeted: budgetPlan.summary.totalAllocated,
                totalActual: expenses.reduce((sum, e) => sum + e.amount, 0),
                categories: comparison,
                overallStatus: this.calculateOverallStatus(comparison)
            };
        } catch (error) {
            console.error('Error comparing with actual spending:', error);
            return null;
        }
    }

    // Calculate overall budget status
    calculateOverallStatus(comparison) {
        const overBudgetCategories = comparison.filter(cat => cat.status === 'over').length;
        const warningCategories = comparison.filter(cat => cat.status === 'warning').length;
        
        if (overBudgetCategories > 2) return 'critical';
        if (overBudgetCategories > 0 || warningCategories > 3) return 'warning';
        return 'good';
    }
}

module.exports = new AIBudgetPlannerService(); 