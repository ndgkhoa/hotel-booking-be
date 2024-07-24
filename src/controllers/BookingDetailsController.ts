import { Request, Response } from 'express'
import BookingDetail from '../models/bookingDetail'

const BookingDetailsController = {
    getAllDetails: async (req: Request, res: Response) => {
        try {
            const bookingDetails = await BookingDetail.find()
            res.status(200).json({
                message: 'Get data successfully',
                data: bookingDetails,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingDetailsController
