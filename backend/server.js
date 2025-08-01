require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path=require('path');
const connectDB=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const incomeRoutes=require('./routes/incomeRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const aiBudgetPlannerRoutes=require('./routes/aiBudgetPlannerRoutes');
const app=express();

app.use(cors({
    origin: [
        'http://localhost:5173', // local dev
        'https://financify-five.vercel.app', // Vercel frontend
        'https://financify.vercel.app', // New Vercel frontend
        'https://financify-frontend.vercel.app', // Additional Vercel frontend
        'https://financify-xnc2.vercel.app', // Your current Vercel frontend
        'https://financify-juectqvqw-sheezamannazeers-projects.vercel.app', // Your actual frontend
        'https://expense-tracker-8u6u0vo2h-sheezamannazeers-projects.vercel.app', // New deployed frontend
        'https://expense-tracker-244jqizkp-sheezamannazeers-projects.vercel.app' // Production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

connectDB();

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/income",incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);
app.use("/api/v1/ai-budget-planner",aiBudgetPlannerRoutes);


//server uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));







