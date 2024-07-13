import { Request, Response } from 'express'
import Coupon from '../models/coupon'

const CouponsController = {
    createCoupon: async (req: Request, res: Response) => {
        const { code, type, value, expirationDate } = req.body
        try {
            const existingCoupon = await Coupon.findOne({ code })
            if (existingCoupon) {
                return res
                    .status(400)
                    .json({ message: 'Coupon code already exists' })
            }

            const newCoupon = new Coupon({ code, type, value, expirationDate })
            await newCoupon.save()

            res.status(201).json({
                message: 'Coupon created successfully',
                data: newCoupon,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error creating coupon', error })
        }
    },
}

export default CouponsController
