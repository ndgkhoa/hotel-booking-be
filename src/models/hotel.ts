import mongoose from 'mongoose'
import { BookingType, HotelType } from '../shared/types'

const bookingsSchema = new mongoose.Schema<BookingType>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    userId: { type: String, required: true },
    totalCost: { type: Number, required: true },
})

const hotelSchema = new mongoose.Schema<HotelType>({
    userId: { type: String, require: true },
    name: { type: String, require: true },
    city: { type: String, require: true },
    country: { type: String, require: true },
    description: { type: String, require: true },
    type: { type: String, require: true },
    adultCount: { type: Number, require: true },
    childCount: { type: Number, require: true },
    facilities: [{ type: String, require: true }],
    pricePerNight: { type: Number, require: true },
    starRating: { type: Number, require: true, min: 1, max: 5 },
    imageUrls: [{ type: String, require: true }],
    lastUpdate: { type: Date, require: true },
    bookings: [bookingsSchema],
})

const Hotel = mongoose.model<HotelType>('Hotel', hotelSchema)
export default Hotel
