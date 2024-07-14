import mongoose from 'mongoose'

interface PromotionType {
    _id: string
    name: string
    discountPercentage: number
    startDate: Date
    endDate: Date
    imageUrl: string
    status: boolean
}

const promotionSchema = new mongoose.Schema<PromotionType>(
    {
        name: { type: String, required: true },
        discountPercentage: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        imageUrl: { type: String, required: true },
        status: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    },
)

const Promotion = mongoose.model<PromotionType>('Promotion', promotionSchema)

export default Promotion
