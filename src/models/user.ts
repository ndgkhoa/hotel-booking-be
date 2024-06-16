import mongoose from 'mongoose'

export type UserType = {
    _id: string
    email: string
    password: string
    firstName: string
    lastName: string
}

const userSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
})

const User = mongoose.model<UserType>('User', userSchema)

export default User
