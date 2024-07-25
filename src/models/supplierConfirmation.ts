import mongoose from 'mongoose'

interface SupplierConfirmationType {
    userId: string
    code: string
    createdAt: Date
}

const supplierConfirmationSchema =
    new mongoose.Schema<SupplierConfirmationType>(
        {
            userId: { type: String, required: true },
            code: { type: String, required: true },
        },
        {
            timestamps: true,
        },
    )

const SupplierConfirmation = mongoose.model<SupplierConfirmationType>(
    'SupplierConfirmation',
    supplierConfirmationSchema,
)

export default SupplierConfirmation
