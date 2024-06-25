import express, { Request, Response } from 'express'
import verifyToken from '../middlewares/auth'
import Hotel from '../models/hotel'
import { HotelType } from '../shared/types'
import BookingsController from '../controllers/BookingsController'

const router = express.Router()

router.post('/:hotelId', verifyToken, BookingsController.booking)

// router.get('/', verifyToken, async (req: Request, res: Response) => {
//     try {
//         const hotels = await Hotel.find({
//             bookings: { $elemMatch: { userId: req.userId } },
//         })

//         const results = hotels.map((hotel) => {
//             const userBookings = hotel.bookings.filter(
//                 (booking) => booking.userId === req.userId,
//             )
//             const hotelWithUserBookings: HotelType = {
//                 ...hotel.toObject(),
//                 bookings: userBookings,
//             }
//             return hotelWithUserBookings
//         })
//         res.status(200).send(results)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'Unable to fetching bookings' })
//     }
// })

export default router
