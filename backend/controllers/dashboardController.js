const Income = require('../models/Income');
const Expense = require('../models/Expense');

const {isValidObjectId, Types} = require('mongoose');

//Dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Validate userId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch total income 
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId} },
            { $group: { _id: null, totalIncome: { $sum: '$amount' } } }
        ]);

        console.log('Total Income:', totalIncome, { userId: isValidObjectId(userId) });
        
        // Fetch total expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
        ]);

        console.log('Total Expense:', totalExpense, { userId: isValidObjectId(userId) });

        //Get income tracsactions in the last 30 days
        const last30DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get total income for last 30 days
        const incomeLast30Days = last30DaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        
        //Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //Get total expense for last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        //fetch last 5 transactions (income + expense)
        const lastIncomeTransactions = (await Income.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
        ).map(txn => ({
            ...txn.toObject(),
            type: "income",
        }));

        const lastExpenseTransactions = (await Expense.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
        ).map(txn => ({
            ...txn.toObject(),
            type: "expense",
        }));

        const lastTransactions = [
            ...lastIncomeTransactions,
            ...lastExpenseTransactions,
        ].sort((a, b) => b.date - a.date); // Sort latest first

        //Final Response
        res.json({
            totalBalance: (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalExpense || 0),
            totalIncome: totalIncome[0]?.totalIncome || 0,
            totalExpense: totalExpense[0]?.totalExpense || 0,
            last30DaysExpenses:{
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last30DaysExpenseTransactions:{
                total: incomeLast30Days,
                transactions: last30DaysIncomeTransactions, 
            },
            recentTransactions: lastTransactions, 
        });    
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

