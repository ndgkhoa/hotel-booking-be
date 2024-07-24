import { Request, Response } from 'express'
import Receipt from '../models/receipt'
import Room from '../models/room'
import BookingDetail from '../models/bookingDetail'
import Booking from '../models/booking'

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        const { totalCost, method, coupon } = req.body
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

            

            booking.status = true
            booking.updatedAt = new Date() as any
            let checkOut: any = booking.checkOut
            if (!(checkOut instanceof Date)) {
                checkOut = new Date(checkOut)
            }
            await booking.save()

            room.status = false
            room.bookedLatest = checkOut
            await room.save()

            const newReceipt = new Receipt({
                method,
                coupon,
                totalCost,
                userId,
            })
            await newReceipt.save()

            const newBookingDetail = new BookingDetail({
                totalCost,
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
