import mongoose from 'mongoose'
import { BookingType } from '../shared/types'

const BookingSchema = new mongoose.Schema<BookingType>({
    checkIn: { type: Date, require: true },
    checkOut: { type: Date, require: true },
    date: { type: Date, require: true },
    adultCount: { type: Number, require: true },
    childCount: { type: Number, require: true },
    status: { type: String, require: true },
    totalCost: { type: Number, require: true },
    userId: { type: String, require: true },
    roomId: { type: String, require: true },
})

const Booking = mongoose.model<BookingType>('Booking', BookingSchema)

export default Booking
