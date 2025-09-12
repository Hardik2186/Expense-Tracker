// routes/budget.routes.js
import express from 'express';
import {
  addBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} from '../controller/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const budgetRouter = express.Router();

// All budget routes require authentication
budgetRouter.use(protect);

// Create a new budget
budgetRouter.post('/', addBudget);

// Get all budgets (optional filters: month, year)
budgetRouter.get('/', getBudgets);

// Update a budget by ID
budgetRouter.put('/:id', updateBudget);

// Delete a budget by ID
budgetRouter.delete('/:id', deleteBudget);

export default budgetRouter;
