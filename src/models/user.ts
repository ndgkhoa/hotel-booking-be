import mongoose from 'mongoose'
import { UserType } from '../shared/types'

const userSchema = new mongoose.Schema(
    {
        role: { type: String, require: true },
        birthday: { type: Date, require: true },
        address: { type: String, require: true },
        phone: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        firstName: { type: String, require: true },
        lastName: { type: String, require: true },
        status: { type: Boolean, require: true },
    },
    {
        timestamps: true,
    },
)

const User = mongoose.model<UserType>('User', userSchema)

export default User
