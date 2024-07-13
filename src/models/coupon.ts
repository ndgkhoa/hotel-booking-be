import mongoose from 'mongoose'
import { CouponType } from '../shared/types'

const couponSchema = new mongoose.Schema<CouponType>({
    code: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['percentage', 'fixed'] },
    value: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
})

const Coupon = mongoose.model<CouponType>('Coupon', couponSchema)

export default Coupon
