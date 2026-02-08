// שינוי ייבוא הספריות והנתונים ל-import
import { transactions, users } from "../data/dummy_db.js";

import User from '../models/user.js';
import Transaction from '../models/transaction.js';
import Counter from '../models/counterModel.js';

export const getTransactions = async (req, res) => {
    try{

        const userEmail = req.user.email;
    
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const query = {
            $or: [{ fromEmail: userEmail }, { toEmail: userEmail }]
        };
        
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 }) // מהחדש לישן
            .skip(offset)
            .limit(limit);

        const total = await Transaction.countDocuments(query);

        const formattedTransactions = transactions.map(t => {
            const isOutgoing = t.fromEmail === userEmail;
            return {
                id: t.id, // ה-ID הרץ (1, 2, 3...)
                amount: isOutgoing ? -t.amount : t.amount,
                type: isOutgoing ? 'OUT' : 'IN',
                otherParty: isOutgoing ? t.toEmail : t.fromEmail,
                description: t.description,
                status: t.status,
                date: t.createdAt
            };
        })
    
        res.status(200).json({
            success: true,
            data: {
                transactions: formattedTransactions,
                total: total,
                offset: offset,
                limit: limit
            }
        });

    }catch(error)
        {
            res.status(500).json({
                success: false,
                data:
                {
                    message: error.message
                }
            });
        }
};

export const getTransactionsByID = async (req, res) => {
    try {
        const { id } = req.params; // ה-ID מה-URL
        const userEmailFromToken = req.user.email; // המייל שחולץ מה-JWT

        console.log("Searching for transaction:", id, "for user email:", userEmailFromToken);

        // 1. חיפוש הטרנזקציה (הוספת await)
        // אם את משתמשת ב-ID הרץ (1, 2, 3), השתמשי ב-findOne
        const userTransaction = await Transaction.findOne({ id: id });
        
        // 2. בדיקה אם הטרנזקציה קיימת
        if (!userTransaction) {
            return res.status(404).json({
                success: false,
                error: { message: "Transaction Not Found" }
            });
        }
            
        // 3. בדיקת הרשאות (Security)
        // בודקים אם המשתמש הוא השולח או המקבל
        const isOwner = userTransaction.fromEmail === userEmailFromToken || 
                        userTransaction.toEmail === userEmailFromToken;

        if (!isOwner) {
            return res.status(403).json({
                success: false,
                error: { message: "Forbidden: This is not your transaction!" }
            });
        }
            
        // 4. החזרת הנתונים
        res.status(200).json({
            success: true,
            data: {
                transaction: userTransaction
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const transferMoney = async (req, res) => {
    try{

    const { toEmail, amount, transferDescription } = req.body;
        
    const fromUserId = req.user.id; //jwt

    // 1. Validate the transfer amount
    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            error: { message: "Invalid amount. Must be greater than 0." }
        });
    }

    // 2. Locate sender and recipient
    const sender =  await User.findById(fromUserId);
    const recipient = await User.findOne({email: toEmail });

    // 3. Check if the recipient exists
    if (!recipient) {
        return res.status(404).json({
            success: false,
            error: { message: "Recipient not found." }
        });
    }

    // 4. Security check: Prevent self-transfers
    if (sender.email === toEmail) {
        return res.status(400).json({
            success: false,
            error: { message: "Cannot transfer money to your own account." }
        });
    }

    // 5. Balance check
    if (sender.balance < amount) {
        return res.status(400).json({
            success: false,
            error: { message: "Insufficient funds. Current balance: " + sender.balance }
        });
    }
    const counter = await Counter.findOneAndUpdate(
            { id: "transactionId" }, 
            { $inc: { seq: 1 } }, 
            { new: true, upsert: true });

    // 6. Update balances
    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    // const transferId = `t${transactions.length + 1}`;
    const timestamp = new Date().toISOString();
    
    // Prepare transaction records
    const newTransaction = await Transaction.create({
    id: counter.seq,
    fromEmail: sender.email, 
    toEmail: recipient.email, 
    amount: amount,
    status: 'COMPLETED',
    description: transferDescription || "Money Transfer",
    timestamp: timestamp
    });

    // 9. Send success response
    res.status(200).json({
        success: true,
        data: {
            transactionId: newTransaction.id,
            newBalance: sender.balance,
            amountSent: amount,
            recipientName: recipient.firstName
        }
    });
    }catch(error)
    {
        res.status(500).json({
            success: false,
            data:
            {
                message: error.message
            }
        });
    }
};