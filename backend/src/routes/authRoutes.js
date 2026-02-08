import express from 'express';
import { signup, login, verifyLink } from '../controllers/authController.js';

const router = express.Router();


router.post('/signup',signup);
router.post('/login',login);
router.get('/verify',verifyLink);

export default router;