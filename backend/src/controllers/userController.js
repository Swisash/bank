import User from '../models/user.js';
import Transaction from '../models/transaction.js'; // ודאי שהשם נכון

export const getUserInfo = async (req, res) => {
    try {
        // 1. קבלת ה-ID והמייל מהטוקן (חולץ על ידי ה-Middleware)
        const userId = req.user.id;
        const userEmail = req.user.email;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user ID found in token"
            });
        }

        // 2. מציאת המשתמש המלא ב-DB (שימוש ב-await)
        const fullUserInfo = await User.findById(userId);

        if (!fullUserInfo) {
            return res.status(404).json({
                success: false,
                message: "User not found in database"
            });
        }

        // 3. הבאת 10 טרנזקציות אחרונות מה-DB
        // אנחנו מחפשים איפה המשתמש הוא או השולח או המקבל
        const recentUserTransactions = await Transaction.find({
            $or: [{ fromEmail: userEmail }, { toEmail: userEmail }]
        })
        .sort({ createdAt: -1 }) // מהחדש לישן
        .limit(10);

        // 4. שליחת התגובה
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: fullUserInfo._id,
                    email: fullUserInfo.email,
                    firstName: fullUserInfo.firstName,
                    lastName: fullUserInfo.lastName,
                    phone: fullUserInfo.phone,
                },
                account: {
                    accountNumber: Math.floor(100000 + Math.random() * 900000),
                    balance: fullUserInfo.balance || 0,
                    currency: "ILS",
                    status: fullUserInfo.verificationState || "ACTIVE",
                    createdAt: fullUserInfo.createdAt
                },
                recentTransactions: recentUserTransactions
            }
        });

    } catch (error) {
        console.error("Error in getUserInfo:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};