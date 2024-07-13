import { Request, Response } from 'express'
import Receipt from '../models/receipt'
import Room from '../models/room'
import BookingDetail from '../models/bookingDetail'
import Booking from '../models/booking'
import Coupon from '../models/coupon'

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        const { totalCost, method, coupon } = req.body
        let totalCostAfterDiscount = totalCost
        const userId = req.userId
        const bookingId = req.params.bookingId

        try {
            const booking = await Booking.findById({ _id: bookingId })
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' })
            }

            const roomId = booking.roomId
            const room = await Room.findById({ _id: roomId })
            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            if (coupon) {
                const foundCoupon = await Coupon.findOne({
                    code: coupon,
                    isActive: true,
                    expirationDate: { $gte: new Date() },
                })
                if (foundCoupon) {
                    if (foundCoupon.type === 'percentage') {
                        totalCostAfterDiscount =
                            totalCost - (totalCost * foundCoupon.value) / 100
                    } else if (foundCoupon.type === 'fixed') {
                        totalCostAfterDiscount = totalCost - foundCoupon.value
                    }
                    totalCostAfterDiscount = Math.max(totalCostAfterDiscount, 0)
                } else {
                    return res
                        .status(400)
                        .json({ message: 'Invalid or expired coupon' })
                }
            }

            room.status = false
            await room.save()

            booking.status = true
            await booking.save()

            const newReceipt = new Receipt({
                method,
                coupon,
                date: new Date(),
                totalCost: parseFloat(totalCostAfterDiscount.toFixed(2)),
                userId,
            })
            await newReceipt.save()

            const newBookingDetail = new BookingDetail({
                totalCost: totalCostAfterDiscount,
                roomId,
                receiptId: newReceipt._id,
                bookingId,
            })
            await newBookingDetail.save()

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
