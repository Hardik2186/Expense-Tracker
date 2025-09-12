import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import budgetRouter from './routes/budget.routes.js';
import reportRouter from './routes/report.routes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));


app.use('/api/auth',authRouter);
app.use('/api/transactions',transactionRouter);
app.use('/api/budgets',budgetRouter);
app.use('/api/reports',reportRouter);

export default app;