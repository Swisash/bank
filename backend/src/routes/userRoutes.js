import express from 'express';
// ייבוא הפונקציה מהקונטרולר - חובה להוסיף .js בסוף
import { getUserInfo } from '../controllers/userController.js';
// ייבוא המידלוור - חובה להוסיף .js בסוף
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// הגדרת הראוט
router.get('/', authMiddleware, getUserInfo);

// ייצוא הראוטר בפורמט מודרני
export default router;