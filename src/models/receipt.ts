import mongoose from 'mongoose'
import { ReceiptType } from '../shared/types'

const ReceiptSchema = new mongoose.Schema<ReceiptType>(
    {
        totalCost: { type: Number, required: true },
        userId: { type: String, required: true },
        method: { type: String, required: true },
        coupon: { type: String },
    },
    {
        timestamps: true,
    },
)

const Receipt = mongoose.model<ReceiptType>('Receipt', ReceiptSchema)

export default Receipt
