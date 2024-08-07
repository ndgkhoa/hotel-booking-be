import mongoose from 'mongoose'
import { BookingType } from '../shared/types'

const bookingSchema = new mongoose.Schema<BookingType>(
    {
        checkIn: { type: Date, require: true },
        checkOut: { type: Date, require: true },
        adultCount: { type: Number, require: true },
        childCount: { type: Number, require: true },
        status: { 
            type: String, 
            enum: ['pending', 'paid', 'canceled'], 
            require: true, 
            default: 'pending' 
        },
        totalCost: { type: Number, require: true },
        userId: { type: String, require: true },
        roomId: { type: String, require: true },
    },
    {
        timestamps: true,
    },
)

const Booking = mongoose.model<BookingType>('Booking', bookingSchema)

export default Booking
