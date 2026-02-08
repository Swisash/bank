import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    fromEmail: { type: String, required: true },
    toEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['PENDING', 'COMPLETED', 'FAILED'], 
        default: 'COMPLETED', 
        required: true 
    },
    description: { type: String }
}, {
    timestamps: true 
});

export default mongoose.model('Transaction', transactionSchema);
