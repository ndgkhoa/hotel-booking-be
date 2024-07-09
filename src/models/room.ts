import mongoose from 'mongoose'
import { RoomType } from '../shared/types'

const roomSchema = new mongoose.Schema<RoomType>({
    hotelId: { type: String, require: true },
    name: { type: String, require: true },
    status: { type: String, require: true },
    facilities: [{ type: String, require: true }],
    adultCount: { type: Number, require: true },
    childCount: { type: Number, require: true },
    pricePerNight: { type: Number, require: true },
    imageUrls: [{ type: String, require: true }],
})

const Room = mongoose.model<RoomType>('Room', roomSchema)

export default Room
