import mongoose from 'mongoose'
import { ReceiptType } from '../shared/types'

const ReceiptSchema = new mongoose.Schema<ReceiptType>({
    paymentId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: Date, require: true },
    total: { type: Number, require: true },
    userId: { type: String, require: true },
})

const Receipt = mongoose.model<ReceiptType>('Receipt', ReceiptSchema)

export default Receipt
