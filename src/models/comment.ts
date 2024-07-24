import mongoose from 'mongoose'
import { CommentType } from '../shared/types'

const commentSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        hotelId: { type: String, require: true },
        content: { type: String, require: true },
        status: { type: Boolean, require: true, default: false },
    },
    {
        timestamps: true,
    },
)

const Comment = mongoose.model<CommentType>('Comment', commentSchema)

export default Comment
