import User from '../models/user.js'; // חובה להוסיף סיומת .js ב-import
import { sendEmail } from "../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // בדיקה אם המשתמש קיים
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ success: false, message: "User already exists" });
        }

        // יצירת טוקן
        const verificationToken = crypto.randomBytes(32).toString('hex');
       
        // יצירת המשתמש
        const newUser = await User.create({
            email,
            password, 
            firstName,
            lastName,
            phone,
            verificationToken 
        });

        // לוגיקת המייל (כרגע בהערה כדי שלא יתקע לך את פוסטמן)
        const link = `http://localhost:3000/api/v1/auth/verify?token=${verificationToken}`;
        const emailMessage = `Welcome to the Bank! Please verify your account:\n\n${link}`;
        
        console.log("Attempting to send email to:", newUser.email);

         await sendEmail({
            email: newUser.email,
            subject: 'Account Verification - The Bank',
            message: emailMessage
        });
        
        console.log("Email sent successfully!");

        res.status(201).json({
            success: true, 
            data: {
                userId: newUser._id, 
                email: newUser.email,
                verificationState: newUser.verificationState
            }
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const verifyLink = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }

        user.verificationState = 'ACTIVE';
        user.verificationToken = undefined;
        await user.save();

        const accessToken = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: "Account successfully verified!",
            data: { token: accessToken }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (user.verificationState !== 'ACTIVE') {
           return res.status(403).json({ 
               success: false, 
               message: `Your account is ${user.verificationState}. Please verify email` 
           });
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            data: { userId: user._id, jwt: accessToken }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Login error" });
    }
};