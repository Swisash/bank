import express from 'express';
// ייבוא הפונקציות מהקונטרולר - חובה להוסיף .js בסוף
import { 
    getTransactions, 
    getTransactionsByID, 
    transferMoney 
} from '../controllers/transactionController.js';

// ייבוא המידלוור - חובה להוסיף .js בסוף
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// הגדרת הראוטים
router.get('/:id', authMiddleware, getTransactionsByID);
router.get('/', authMiddleware, getTransactions);
router.post('/', authMiddleware, transferMoney);

// ייצוא הראוטר בפורמט מודרני
export default router;