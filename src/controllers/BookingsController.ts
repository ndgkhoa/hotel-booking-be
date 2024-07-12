import { Request, Response } from 'express'
import Booking from '../models/booking'
import Hotel from '../models/hotel'
import Room from '../models/room'

const BookingsController = {
    booking: async (req: Request, res: Response) => {
        const { checkIn, checkOut, numberOfNights } = req.body
        const roomId = req.params.roomId
        const userId = req.userId
        if (!checkIn || !checkOut || !numberOfNights) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        try {
            const room = await Room.findById(roomId)
            if (!room) {
                return res.status(400).json({ message: 'Room not found' })
            }
            const totalCost = parseFloat(
                (room.pricePerNight * numberOfNights).toFixed(2),
            )
            const newBooking = new Booking({
                checkIn,
                checkOut,
                date: new Date(),
                status: 'Pending',
                totalCost,
                userId,
                roomId,
            })
            await newBooking.save()
            res.status(201).send(newBooking)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getMyBookings: async (req: Request, res: Response) => {
        const userId = req.userId
        try {
            const bookings = await Booking.find({ userId })
            res.status(200).json({
                message: 'Get data successfully',
                data: bookings,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingsController
