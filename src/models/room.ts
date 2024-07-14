import mongoose from 'mongoose'
import { RoomType } from '../shared/types'

const roomSchema = new mongoose.Schema<RoomType>({
    hotelId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: Boolean, required: true },
    facilities: [{ type: String, required: true }],
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    imageUrls: [{ type: String, required: true }],
    createDate: { type: Date, required: true },
})

const Room = mongoose.model<RoomType>('Room', roomSchema)

export default Room
