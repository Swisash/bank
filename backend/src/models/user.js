import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    verificationState: { type: String, enum: ['PENDING', 'ACTIVE', 'BLOCKED'], default: 'PENDING' },
    balance: { type: Number, default: 500 },
    verificationToken: { type: String }
}, {
    timestamps: true 
});

export default mongoose.model('user', userSchema);