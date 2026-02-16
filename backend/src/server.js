//load JWT_SECRET to the server memory
import 'dotenv/config';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { createServer } from 'http';
import { Server } from 'socket.io';

//bring the package exspress that i install with npm install
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import userRoutes from './routes/userRoutes.js';

//import chatbotRoutes from './routes/chatbotRoutes.js';
import { chatbot } from './controllers/chatbotController.js';

//create the server itself
const app = express();

//prepare the new way to io socket
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.FRONT_URL || "http://localhost:5173", // וודאי שזה תואם לפרונט (Vite בד"כ 5173)
  credentials: true
};


//app.use(cors());
app.use(cors(corsOptions));

app.use(express.json());

const io = new Server(httpServer, {
  cors: corsOptions
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token; // הפרונט ישלח את זה ב-auth object

    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error("Authentication error: Invalid token"));
        
        socket.user = decoded; // שמירת פרטי המשתמש על הסוקט
        next();
    });
});

io.on("connection", (socket) => {
    console.log(`🔌 User connected to Socket: ${socket.user.id} (Socket ID: ${socket.id})`);
    chatbot(io, socket); // הפעלת הלוגיקה של הבוט
    
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const dbURI = process.env.DB_URI;;

 mongoose.connect(dbURI)
   .then(() => console.log('Connected to mongoDB '))
   .catch((err) => console.log("MongoDB error connection", err));

   //for debug
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers.authorization ? "Auth present" : "No Auth");
    next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions',transactionsRoutes);
app.use('/api/v1/user',userRoutes);
//app.use('/api/v1/chatbot', chatbotRoutes);

app.get('/api/v1/test', (req, res) => {
    console.log("Test route was hit!");
    res.status(200).json({ message: "The server is alive and kicking!" });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  Bank Server is running on port ${PORT}   `);
    console.log(`  Link: http://localhost:${PORT}          `);
    console.log(`=========================================`);
});
