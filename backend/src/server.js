//load JWT_SECRET to the server memory
import 'dotenv/config';
import cors from 'cors';

//bring the package exspress that i install with npm install
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import userRoutes from './routes/userRoutes.js';


//create the server itself
const app = express();

//app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // וודאי שזה הפורט המדויק שלך
  credentials: true
}));

app.use(express.json());

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

//middleware command, it stand in the entarance of the server and take the text of the request and convert it to JSON

//every request that arrive the server will send her to authRouth and there they will take care the request
//app.use('/api/v1/', (req, res)=>{console.log("here");res.send("test api")});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions',transactionsRoutes);
app.use('/api/v1/user',userRoutes);

app.get('/api/v1/test', (req, res) => {
    console.log("Test route was hit!");
    res.status(200).json({ message: "The server is alive and kicking!" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`  Bank Server is running on port ${PORT}   `);
    console.log(`  Link: http://localhost:${PORT}          `);
    console.log(`=========================================`);
});
