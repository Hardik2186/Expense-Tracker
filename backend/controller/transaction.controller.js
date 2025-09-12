
import Transaction from "../model/transaction.model.js";
import Budget from "../model/budget.model.js";


export const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, mode, payee, description, date } = req.body;
    const userId = req.user._id;

    // Check budget if expense
    if (type === "expense") {
      const d = date ? new Date(date) : new Date();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      const budget = await Budget.findOne({ userId, category, month, year });

      if (budget) {
        // Calculate total spent in this category this month
        const spent = await Transaction.aggregate([
          { 
            $match: { 
              userId, 
              category, 
              type: "expense",
              date: { 
                $gte: new Date(year, month - 1, 1), 
                $lte: new Date(year, month, 0) 
              }
            } 
          },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalSpent = spent.length ? spent[0].total : 0;

        if (totalSpent + amount > budget.amount) {
          return res.status(400).json({ 
            message: `Budget exceeded for ${category}. Limit: ${budget.amount}, Already spent: ${totalSpent}` 
          });
        }
      }
    }

    const transaction = await Transaction.create({
      userId,
      title,
      amount,
      type,
      category,
      mode,
      payee,
      description,
      date
    });

    res.status(201).json(transaction);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    // Optional filters
    const filters = { userId };
    if (req.query.type) filters.type = req.query.type;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.mode) filters.mode = req.query.mode;

    const transactions = await Transaction.find(filters).sort({ date: -1 });

    res.json(transactions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ensure user owns transaction
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(transaction);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields
    const { title, amount, type, category, mode, payee, description, date } = req.body;

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.mode = mode || transaction.mode;
    transaction.payee = payee || transaction.payee;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;

    await transaction.save();

    res.json(transaction);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.remove();

    res.json({ message: "Transaction removed" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
