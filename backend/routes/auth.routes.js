import express from 'express';
import { getMe, login, register } from '../controller/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const authRouter = express.Router();


authRouter.post('/register', register);
authRouter.post('/login',login);
authRouter.get('/me',protect,getMe);

export default authRouter;