const xlsx = require('xlsx');
const Income = require('../models/Income');

//Add Income Source
exports.addIncome= async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, source, amount, date } = req.body;

        // Validate input
        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'All feilds are required' });
        }

        // Create new income entry
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date:new Date(date)
        });

        await newIncome.save();
        res.status(200).json({ message: 'Income source added successfully', income: newIncome });
    } catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Get All Income Sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//Delete Income Source
exports.deleteIncome = async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: 'Income  deleted successfully' });
    }catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Download Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb=xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Income');
        xlsx.writeFile(wb, 'Income.xlsx');
        res.download('Income.xlsx');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}