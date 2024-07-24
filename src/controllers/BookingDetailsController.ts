import { Request, Response } from 'express'
import Hotel from '../models/hotel'
import Room from '../models/room'
import BookingDetail from '../models/bookingDetail'

const BookingDetailsController = {
    getAllDetails: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

            const hotels = await Hotel.find({ supplierId })

            if (hotels.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No hotels found for this supplier' })
            }

            const hotelIds = hotels.map((hotel) => hotel._id)

            const rooms = await Room.find({ hotelId: { $in: hotelIds } })

            if (rooms.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No rooms found for these hotels' })
            }

            const roomIds = rooms.map((room) => room._id)

            const bookingDetails = await BookingDetail.find({
                roomId: { $in: roomIds },
            })

            res.status(200).json({
                message: 'Get booking details successfully',
                data: bookingDetails,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingDetailsController
