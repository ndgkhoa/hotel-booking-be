import mongoose from 'mongoose'
import { CommentType } from '../shared/types'

const commentSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        hotelId: { type: String, require: true },
        content: { type: String, require: true },
        rating: { type: Number, require: true, min: 1, max: 5 },
        status: { type: Boolean, require: true, default: false },
    },
    {
        timestamps: true,
    },
)

const Comment = mongoose.model<CommentType>('Comment', commentSchema)

export default Comment
