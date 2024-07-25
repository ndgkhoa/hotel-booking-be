import mongoose from 'mongoose'
import { BookingDetailType } from '../shared/types'

const bookingDetail = new mongoose.Schema<BookingDetailType>(
    {
        totalCost: { type: Number, require: true },
        roomId: { type: String, require: true },
        receiptId: { type: String, require: true },
        bookingId: { type: String, require: true },
    },
    {
        timestamps: true,
    },
)

const BookingDetail = mongoose.model<BookingDetailType>(
    'BookingDetail',
    bookingDetail,
)

export default BookingDetail
