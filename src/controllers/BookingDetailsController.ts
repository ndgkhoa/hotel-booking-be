import { Request, Response } from 'express'
import BookingDetail from '../models/bookingDetail'
import { ReceiptType } from '../shared/types'
import Room from '../models/room'

const BookingDetailsController = {
    getAllDetails: async (req: Request, res: Response) => {
        try {
            const bookingDetails = await BookingDetail.find().lean()
            res.status(200).json({
                message: 'Get data successfully',
                data: bookingDetails,
            })
        } catch (error) {
            console.error('Error retrieving booking details:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getTotalCostOfRoom: async (req: Request, res: Response) => {
        const { roomId } = req.params
        if (!roomId) {
            return res.status(400).json({ message: 'Room ID is required' })
        }
        try {
            const bookingDetails = await BookingDetail.find({ roomId })
                .populate('receiptId')
                .lean()
            const totalRevenue = bookingDetails.reduce(
                (total, detail) => total + detail.totalCost,
                0,
            )
            res.status(200).json({
                message: 'Total revenue retrieved successfully',
                data: totalRevenue,
            })
        } catch (error) {
            console.error('Error retrieving booking details:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getBookingDetailCountByRoom: async (req: Request, res: Response) => {
        try {
            const roomBookingCounts = await BookingDetail.aggregate([
                {
                    $group: {
                        _id: '$roomId',
                        bookingCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        roomId: '$_id',
                        bookingCount: 1,
                    },
                },
            ])
            res.status(200).json({
                message: 'Room booking counts retrieved successfully',
                data: roomBookingCounts,
            })
        } catch (error) {
            console.error('Error retrieving room booking counts:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingDetailsController
