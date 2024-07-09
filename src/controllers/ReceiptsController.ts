import { Request, Response } from 'express'
import Receipt from '../models/receipt'

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        try {
            const { totalCost, method, coupon } = req.body
            const userId = req.userId
            const newReceipt = new Receipt({
                method,
                coupon,
                date: new Date(),
                total: parseFloat(totalCost),
                userId,
            })
            await newReceipt.save()
            res.status(201).json({
                message: 'Receipt created successfully',
                data: newReceipt,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default ReceiptsController
