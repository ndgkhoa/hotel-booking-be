import mongoose from 'mongoose'
import { ReceiptType } from '../shared/types'

const ReceiptSchema = new mongoose.Schema<ReceiptType>({
    date: { type: Date, required: true },
    total: { type: Number, required: true },
    userId: { type: String, required: true },
    method: { type: String, required: true },
    coupon: { type: String, required: true },
})

const Receipt = mongoose.model<ReceiptType>('Receipt', ReceiptSchema)

export default Receipt
