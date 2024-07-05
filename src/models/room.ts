import mongoose from 'mongoose'
import { RoomType } from '../shared/types'

const roomSchema = new mongoose.Schema<RoomType>({
    name: { type: String, require: true },
    status: { type: String, require: true },
    adultCount: { type: Number, require: true },
    childCount: { type: Number, require: true },
    pricePerNight: { type: Number, require: true },
    imageUrls: [{ type: String, require: true }],
})

const Room = mongoose.model<RoomType>('Hotel', roomSchema)

export default Room
