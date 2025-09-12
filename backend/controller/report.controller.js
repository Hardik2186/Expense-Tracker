// controllers/report.controller.js
import Transaction from "../model/transaction.model.js";

// @desc    Get summary report (total income, total expense, balance)
// @route   GET /api/reports/summary
// @access  Private
export const getSummaryReport = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0, expense = 0;
    result.forEach(r => {
      if (r._id === "income") income = r.total;
      if (r._id === "expense") expense = r.total;
    });

    res.json({
      income,
      expense,
      balance: income - expense
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get monthly report (income, expense, balance)
// @route   GET /api/reports/monthly?month=MM&year=YYYY
// @access  Private
export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = parseInt(req.query.month); // 1-12
    const year = parseInt(req.query.year);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      { $match: { userId, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0, expense = 0;
    result.forEach(r => {
      if (r._id === "income") income = r.total;
      if (r._id === "expense") expense = r.total;
    });

    res.json({
      month,
      year,
      income,
      expense,
      balance: income - expense
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get category-wise report (total expense per category)
// @route   GET /api/reports/by-category?month=MM&year=YYYY
// @access  Private
export const getCategoryReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      { $match: { userId, type: "expense", date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(result); // returns array [{ _id: "Food", total: 2000 }, ...]
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get mode-wise report (cash vs online)
// @route   GET /api/reports/by-mode?month=MM&year=YYYY
// @access  Private
export const getModeReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      { $match: { userId, type: "expense", date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$mode",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(result); // returns array [{ _id: "Cash", total: 3000 }, { _id: "Online", total: 2000 }]
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
