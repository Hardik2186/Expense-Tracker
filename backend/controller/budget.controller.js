import Budget from "../model/budget.model.js";

// @desc    Add a new budget
// @route   POST /api/budgets
// @access  Private
export const addBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    const userId = req.user._id;

    // Check if budget already exists for this user + category + month/year
    const existing = await Budget.findOne({ userId, category, month, year });
    if (existing) {
      return res.status(400).json({ message: "Budget already set for this category & month" });
    }

    const budget = await Budget.create({ userId, category, amount, month, year });

    res.status(201).json(budget);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all budgets for user (optional month/year filter)
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const filters = { userId };

    if (req.query.month) filters.month = parseInt(req.query.month);
    if (req.query.year) filters.year = parseInt(req.query.year);

    const budgets = await Budget.find(filters).sort({ month: 1 });

    res.json(budgets);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { category, amount, month, year } = req.body;

    budget.category = category || budget.category;
    budget.amount = amount || budget.amount;
    budget.month = month || budget.month;
    budget.year = year || budget.year;

    await budget.save();

    res.json(budget);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await budget.remove();

    res.json({ message: "Budget removed successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
