import { Request, Response } from 'express'
import Receipt from '../models/receipt'
import Room from '../models/room'
import BookingDetail from '../models/bookingDetail'
import Booking from '../models/booking'

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        try {
            const { totalCost, method, coupon, adultCount, childCount } =
                req.body

            const userId = req.userId
            const bookingId = req.params.bookingId

            const booking = await Booking.findById(bookingId)
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' })
            }

            const roomId = booking.roomId
            const room = await Room.findById(roomId)
            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            room.status = false
            await room.save()

            const newReceipt = new Receipt({
                method,
                coupon,
                date: new Date(),
                total: parseFloat(totalCost),
                userId,
            })
            await newReceipt.save()

            const newBookingDetail = new BookingDetail({
                totalCost,
                adultCount,
                childCount,
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
