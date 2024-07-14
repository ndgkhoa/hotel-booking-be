import mongoose from 'mongoose'
import { HotelType } from '../shared/types'

const hotelSchema = new mongoose.Schema<HotelType>(
    {
        userId: { type: String, require: true },
        name: { type: String, require: true },
        city: { type: String, require: true },
        country: { type: String, require: true },
        description: { type: String, require: true },
        status: { type: Boolean, require: true },
        categories: { type: String, require: true },
        starRating: { type: Number, require: true, min: 1, max: 5 },
        imageUrls: [{ type: String, require: true }],
    },
    {
        timestamps: true,
    },
)

const Hotel = mongoose.model<HotelType>('Hotel', hotelSchema)

export default Hotel
