import { Request, Response } from 'express'
import Booking from '../models/booking'
import Hotel from '../models/hotel'

const BookingsController = {
    booking: async (req: Request, res: Response) => {
        // const { checkIn, checkOut, numberOfNights } = req.body
        // const hotelId = req.params.hotelId
        // const userId = req.userId
        // if (!checkIn || !checkOut || !numberOfNights) {
        //     return res.status(400).json({ message: 'Missing required fields' })
        // }
        // try {
        //     const hotel = await Hotel.findById(hotelId)
        //     if (!hotel) {
        //         return res.status(400).json({ message: 'Hotel not found' })
        //     }
        //     const totalCost = parseFloat(
        //         (hotel.pricePerNight * numberOfNights).toFixed(2),
        //     )
        //     const newBooking = new Booking({
        //         checkIn,
        //         checkOut,
        //         date: new Date(),
        //         status: 'Pending',
        //         totalCost,
        //         userId,
        //         hotelId,
        //     })
        //     await newBooking.save()
        //     res.status(201).send(newBooking)
        // } catch (error) {
        //     console.error(error)
        //     res.status(500).json({ message: 'Something went wrong' })
        // }
    },

    bookingWithoutLogin: async (req: Request, res: Response) => {
        // const { checkIn, checkOut, numberOfNights, email, phone } = req.body
        // const hotelId = req.params.hotelId
        // if (!checkIn || !checkOut || !numberOfNights) {
        //     return res.status(400).json({ message: 'Missing required fields' })
        // }
        // try {
        //     const hotel = await Hotel.findById(hotelId)
        //     if (!hotel) {
        //         return res.status(400).json({ message: 'Hotel not found' })
        //     }
        //     const totalCost = parseFloat(
        //         (hotel.pricePerNight * numberOfNights).toFixed(2),
        //     )
        //     const newBooking = new Booking({
        //         checkIn,
        //         checkOut,
        //         date: new Date(),
        //         status: 'Pending',
        //         totalCost,
        //         hotelId,
        //         email,
        //         phone,
        //     })
        //     await newBooking.save()
        //     res.status(201).send(newBooking)
        // } catch (error) {
        //     console.error(error)
        //     res.status(500).json({ message: 'Something went wrong' })
        // }
    },
}

export default BookingsController
