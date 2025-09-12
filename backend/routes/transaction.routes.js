import express from 'express';
import {
  addTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from '../controller/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const transactionRouter = express.Router();

// All routes are protected (require login)
transactionRouter.use(protect);

// Create a new transaction
transactionRouter.post('/', addTransaction);

// Get all transactions (with optional filters)
transactionRouter.get('/', getTransactions);

// Get a single transaction by ID
transactionRouter.get('/:id', getTransaction);

// Update a transaction by ID
transactionRouter.put('/:id', updateTransaction);

// Delete a transaction by ID
transactionRouter.delete('/:id', deleteTransaction);

export default transactionRouter;
