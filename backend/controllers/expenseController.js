const xlsx = require('xlsx');
const Expense = require('../models/Expense');

//Add Expense Source
exports.addExpense= async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, category, amount, date } = req.body;

        // Validate input
        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All feilds are required' });
        }

        // Create new expense entry
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date:new Date(date)
        });

        await newExpense.save();
        res.status(200).json({ message: 'Expense source added successfully', Expense: newExpense });
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Get All Expense Sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense  deleted successfully' });
    }catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb=xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Expense');
        xlsx.writeFile(wb, 'Expense.xlsx');
        res.download('Expense.xlsx');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}