import mongoose from 'mongoose'
import { AccountType } from '../shared/types'

const accountSchema = new mongoose.Schema({
    userId: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
})

const Account = mongoose.model<AccountType>('Account', accountSchema)

export default Account
