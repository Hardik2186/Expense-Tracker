// routes/report.routes.js
import express from 'express';
import {
  getSummaryReport,
  getMonthlyReport,
  getCategoryReport,
  getModeReport
} from '../controller/report.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const reportRouter = express.Router();

// All report routes require authentication
reportRouter.use(protect);

// Summary report
reportRouter.get('/summary', getSummaryReport);

// Monthly report (requires query: month & year)
reportRouter.get('/monthly', getMonthlyReport);

// Category-wise report (requires query: month & year)
reportRouter.get('/by-category', getCategoryReport);

// Mode-wise report (requires query: month & year)
reportRouter.get('/by-mode', getModeReport);

export default reportRouter;
