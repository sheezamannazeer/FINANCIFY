# 🤖 AI Budget Planner Setup Guide

## Overview
The AI Budget Planner is a unique feature that uses Google's Gemini AI to intelligently allocate your monthly budget across different expense categories. It analyzes your spending history and requirements to create personalized budget plans.

## Features

### 🎯 **AI-Powered Budget Allocation**
- **Intelligent Categorization**: Automatically allocates budget based on your requirements
- **Spending History Analysis**: Considers your past spending patterns
- **Priority-Based Allocation**: Prioritizes essential expenses (rent, food, utilities)
- **Savings Integration**: Ensures minimum savings allocation
- **Personalized Tips**: Provides specific tips for each category

### 📊 **Budget Tracking & Insights**
- **Real-time Comparison**: Compare actual spending with budget plan
- **Performance Insights**: Get alerts when exceeding budget limits
- **Trend Analysis**: Track spending patterns over time
- **Recommendations**: AI-generated suggestions for budget optimization

## Setup Instructions

### 1. **Install Dependencies**
```bash
cd backend
npm install @google/generative-ai moment natural ml-regression ml-matrix node-cron
```

### 2. **Get Gemini API Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 3. **Configure Environment Variables**
Add to your `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. **Start the Application**
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend/expense-tracker
npm run dev
```

## How to Use

### **Generate AI Budget Plan**

1. **Navigate to Dashboard**: The AI Budget Planner is available on your main dashboard

2. **Enter Your Budget**: 
   - Total monthly budget amount
   - Your specific requirements and priorities

3. **Example Input**:
   ```
   Total Budget: ₹50000
   
   Requirements: I have ₹5000 budget for this month and I need to spend on:
   - Rent: ₹15000
   - Food and groceries
   - Transportation (bus/metro)
   - Utilities (electricity, internet)
   - Some entertainment
   - Want to save for vacation
   ```

4. **AI Analysis**: The system will:
   - Analyze your spending history
   - Consider your requirements
   - Generate optimal budget allocation
   - Provide category-specific tips
   - Create actionable recommendations

### **Sample AI Response**
```json
{
  "categories": [
    {
      "name": "Rent/Housing",
      "allocated": 15000,
      "priority": "high",
      "description": "Monthly rent payment",
      "tips": ["Try to keep housing costs under 30% of income"],
      "percentage": 30
    },
    {
      "name": "Food & Groceries",
      "allocated": 8000,
      "priority": "high",
      "description": "Daily meals and household groceries",
      "tips": ["Plan meals in advance", "Buy in bulk for non-perishables"],
      "percentage": 16
    },
    {
      "name": "Transportation",
      "allocated": 3000,
      "priority": "high",
      "description": "Bus, metro, and occasional taxi",
      "tips": ["Use public transport when possible", "Consider monthly passes"],
      "percentage": 6
    },
    {
      "name": "Utilities",
      "allocated": 2500,
      "priority": "high",
      "description": "Electricity, internet, phone bills",
      "tips": ["Turn off unused appliances", "Compare utility providers"],
      "percentage": 5
    },
    {
      "name": "Entertainment",
      "allocated": 3000,
      "priority": "medium",
      "description": "Movies, dining out, hobbies",
      "tips": ["Look for free entertainment options", "Set limits on dining out"],
      "percentage": 6
    },
    {
      "name": "Savings",
      "allocated": 7500,
      "priority": "high",
      "description": "Emergency fund and vacation savings",
      "tips": ["Pay yourself first", "Automate savings transfers"],
      "percentage": 15
    },
    {
      "name": "Miscellaneous",
      "allocated": 2000,
      "priority": "low",
      "description": "Unexpected expenses and buffer",
      "tips": ["Keep some buffer for unexpected costs"],
      "percentage": 4
    }
  ],
  "summary": {
    "totalAllocated": 50000,
    "remaining": 0,
    "savingsRate": 15,
    "keyInsights": [
      "Your budget is well-balanced with 15% savings",
      "Housing costs are within recommended 30% range",
      "Consider tracking actual spending vs budget"
    ]
  },
  "recommendations": [
    "Track your spending daily to stay within budget",
    "Review and adjust budget monthly based on actual expenses",
    "Build an emergency fund of 3-6 months expenses"
  ]
}
```

## API Endpoints

### **Generate Budget Plan**
```http
POST /api/v1/ai-budget-planner/generate
Content-Type: application/json
Authorization: Bearer <token>

{
  "totalBudget": 50000,
  "requirements": "I need to pay rent of ₹15000, food expenses, transportation, and want to save for vacation."
}
```

### **Get Current Budget Plan**
```http
GET /api/v1/ai-budget-planner/current
Authorization: Bearer <token>
```

### **Get Budget Insights**
```http
GET /api/v1/ai-budget-planner/insights
Authorization: Bearer <token>
```

### **Compare with Actual Spending**
```http
GET /api/v1/ai-budget-planner/compare?month=2024-01
Authorization: Bearer <token>
```

## Key Features

### **🤖 AI Intelligence**
- **Context-Aware**: Considers your spending history and requirements
- **Smart Allocation**: Prioritizes essential expenses automatically
- **Learning**: Improves recommendations based on your patterns
- **Fallback**: Provides sensible defaults if AI fails

### **📈 Budget Tracking**
- **Real-time Monitoring**: Track spending against budget
- **Visual Progress**: See budget usage with progress bars
- **Alerts**: Get notified when approaching limits
- **Insights**: Understand spending patterns

### **🎯 Personalization**
- **Custom Categories**: Adapts to your specific needs
- **Flexible Requirements**: Handles various budget scenarios
- **Priority Levels**: High/medium/low priority categories
- **Tips & Recommendations**: Personalized advice

## Troubleshooting

### **Common Issues**

1. **API Key Error**
   - Ensure `GEMINI_API_KEY` is set in `.env`
   - Verify the API key is valid and has proper permissions

2. **Budget Plan Not Generating**
   - Check if you have sufficient spending history
   - Ensure requirements are detailed enough
   - Verify all dependencies are installed

3. **Performance Issues**
   - The AI analysis may take 5-10 seconds
   - Ensure stable internet connection for API calls

### **Fallback Behavior**
If the AI service fails, the system provides a sensible default budget plan based on common financial guidelines:
- 30% for housing
- 15% for food
- 10% for transportation
- 10% for utilities
- 15% for savings
- 20% for discretionary spending

## Security & Privacy

- **API Key Security**: Store API key in environment variables
- **Data Privacy**: All analysis is done locally with your data
- **No Data Sharing**: Your financial data never leaves your system
- **Secure Storage**: Budget plans are stored securely in your database

## Future Enhancements

- **Multi-Currency Support**: Support for different currencies
- **Advanced Analytics**: More sophisticated spending analysis
- **Goal Integration**: Connect budget plans to financial goals
- **Export Features**: Export budget plans to PDF/Excel
- **Mobile App**: Native mobile application

---

**Note**: This feature requires a valid Gemini API key and internet connection for AI analysis. The system includes fallback mechanisms for offline scenarios. 