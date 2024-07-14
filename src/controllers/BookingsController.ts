import { Request, Response } from 'express'
import Booking from '../models/booking'
import Hotel from '../models/hotel'
import Room from '../models/room'
import User from '../models/user'
import { sendBookingConfirmation } from '../utils/mailer'

const BookingsController = {
    booking: async (req: Request, res: Response) => {
        const { checkIn, checkOut, adultCount, childCount } = req.body
        const roomId = req.params.roomId
        const userId = req.userId
        if (!checkIn || !checkOut || !adultCount || !childCount) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        try {
            const room = await Room.findById(roomId)
            if (!room) {
                return res.status(400).json({ message: 'Room not found' })
            }

            const checkInDate = new Date(checkIn)
            const checkOutDate = new Date(checkOut)
            const timeDifference =
                checkOutDate.getTime() - checkInDate.getTime()
            const numberOfNights = timeDifference / (1000 * 3600 * 24)

            const totalCost = parseFloat(
                (room.pricePerNight * numberOfNights).toFixed(2),
            )

            if (numberOfNights <= 0) {
                return res
                    .status(400)
                    .json({ message: 'Invalid check-in or check-out dates' })
            }

            const newBooking = new Booking({
                checkIn,
                checkOut,
                bookingDate: new Date(),
                status: false,
                adultCount,
                childCount,
                totalCost,
                userId,
                roomId,
            })
            await newBooking.save()

            const user = await User.findById({ _id: userId })
            // if (user) {
            //     await sendBookingConfirmation(user.email, {
            //         checkIn,
            //         checkOut,
            //         adultCount,
            //         childCount,
            //         totalCost,
            //         bookingDate:
            //             newBooking.bookingDate instanceof Date
            //                 ? newBooking.bookingDate
            //                 : undefined,
            //         userName: user.firstName + ' ' + user.lastName,
            //     })
            // }

            res.status(201).send(newBooking)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getBooking: async (req: Request, res: Response) => {
        const bookingId = req.params.bookingId
        try {
            const booking = await Booking.findById({ _id: bookingId })
            if (!booking)
                return res.status(400).json({ message: 'Booking not found' })
            res.status(200).json({
                message: 'Get data successfully',
                data: booking,
            })
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

    getHotelFromBookingId: async (req: Request, res: Response) => {
        const bookingId = req.params.bookingId
        try {
            const booking = await Booking.findById({ _id: bookingId })
            if (!booking)
                return res.status(400).json({ message: 'Booking not found' })

            const roomId = booking.roomId
            const room = await Room.findById({ _id: roomId })
            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            const hotelId = room.hotelId
            const hotel = await Hotel.findById({ _id: hotelId })
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }
            res.status(200).json({
                message: 'Get data successfully',
                data: hotel,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingsController
