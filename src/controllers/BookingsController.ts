import { Request, Response } from 'express'
import Booking from '../models/booking'
import Hotel from '../models/hotel'
import Room from '../models/room'
import User from '../models/user'
import { sendBookingConfirmation } from '../utils/mailer'
import Coupon from '../models/coupon'
import { generateRandomCode } from '../utils/randomCodeUtils'

const BookingsController = {
    booking: async (req: Request, res: Response) => {
        const { checkIn, checkOut, adultCount, childCount } = req.body

        const roomId = req.params.roomId
        const userId = req.userId

        if (
            !checkIn ||
            !checkOut ||
            adultCount === undefined ||
            childCount === undefined ||
            !roomId ||
            !userId
        ) {
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

            if (numberOfNights <= 0) {
                return res
                    .status(400)
                    .json({ message: 'Invalid check-in or check-out dates' })
            }

            const totalCost = parseFloat(
                (room.pricePerNight * numberOfNights).toFixed(2),
            )

            const newBooking = new Booking({
                checkIn,
                checkOut,
                adultCount,
                childCount,
                totalCost,
                userId,
                roomId,
            })
            await newBooking.save()

            const user = await User.findById(userId)
            if (user) {
                await sendBookingConfirmation(user.email, {
                    checkIn,
                    checkOut,
                    adultCount,
                    childCount,
                    totalCost,
                    bookingDate: newBooking.createdAt as unknown as Date,
                    userName: `${user.firstName} ${user.lastName}`,
                })
            }

            res.status(201).send(newBooking)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    bookingWithoutLogin: async (req: Request, res: Response) => {},

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

    getAll: async (req: Request, res: Response) => {
        try {
            const bookings = await Booking.find()
            res.status(200).json({
                message: 'Get data successfully',
                data: bookings,
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

    cancelBooking: async (req: Request, res: Response) => {
        const bookingId = req.params.bookingId
        try {
            const booking = await Booking.findById(bookingId)

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' })
            }

            if (booking.status === 'pending') {
                booking.status = 'canceled'

                await booking.save()
                return res.status(200).json({
                    message: 'Booking canceled successfully',
                    data: booking,
                })
            } else if (booking.status === 'paid') {
                const room = await Room.findById(booking.roomId)
                if (!room) {
                    return res.status(404).json({ message: 'Room not found' })
                }

                let newCoupon
                if (booking.createdAt instanceof Date) {
                    const currentTime = new Date()

                    const expirationDate = new Date(currentTime)
                    expirationDate.setMonth(currentTime.getMonth() + 1)

                    const timeDifference =
                        (booking.checkOut as unknown as Date).getTime() -
                        currentTime.getTime()

                    const hoursDifference = Math.ceil(
                        timeDifference / (1000 * 60 * 60),
                    )

                    const randomCode = generateRandomCode(6)

                    if (hoursDifference >= 48) {
                        newCoupon = new Coupon({
                            supplierId: 'admin',
                            code: randomCode,
                            type: 'percentage',
                            value: 85,
                            expirationDate: expirationDate,
                        })
                    } else if (hoursDifference >= 24) {
                        newCoupon = new Coupon({
                            supplierId: 'admin',
                            code: randomCode,
                            type: 'percentage',
                            value: 50,
                            expirationDate: expirationDate,
                        })
                    } else
                        return res.status(400).json({
                            message: 'You can not cancel this booking',
                        })

                    booking.status = 'canceled'
                    room.status = true

                    await newCoupon.save()
                    await booking.save()
                    await room.save()
                }

                res.status(200).json({
                    message: 'Booking canceled successfully',
                    data: {
                        booking,
                        newCoupon,
                    },
                })
            } else {
                return res.status(400).json({
                    message: 'Canceled booking status',
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    autoCancel: async (req: Request, res: Response) => {
        const userId = req.userId
        try {
            const bookings = await Booking.find({ userId })

            if (bookings.length === 0) {
                return res.status(404).json({ message: 'No booking found' })
            }

            const updatePromises = bookings.map(async (booking) => {
                if (
                    booking.status === 'pending' &&
                    booking.createdAt instanceof Date
                ) {
                    const nowDate = new Date()
                    const timeDifference =
                        nowDate.getTime() - booking.createdAt.getTime()
                    const numberOfDays = timeDifference / (1000 * 3600 * 24)

                    if (numberOfDays >= 3) {
                        booking.status = 'canceled'
                        await booking.save()
                    }
                }
            })

            await Promise.all(updatePromises)

            res.status(200).json({
                message: 'Auto cancel successfully',
                data: bookings,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingsController
