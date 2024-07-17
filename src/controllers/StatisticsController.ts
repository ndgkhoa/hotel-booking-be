import { Request, Response } from 'express'
import Booking from '../models/booking'
import BookingDetail from '../models/bookingDetail'
import { ObjectId } from 'mongodb'

const StatisticsController = {
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

    getMonthlyRevenue: async (req: Request, res: Response) => {
        try {
            const revenues = await Booking.aggregate([
                {
                    $match: {
                        updatedAt: { $exists: true },
                        status: true,
                    },
                },
                {
                    $group: {
                        _id: {
                            roomId: '$roomId',
                            year: { $year: '$updatedAt' },
                            month: { $month: '$updatedAt' },
                        },
                        monthlyRevenue: { $sum: '$totalCost' },
                    },
                },
                {
                    $group: {
                        _id: '$_id.roomId',
                        monthlyRevenues: {
                            $push: {
                                month: '$_id.month',
                                year: '$_id.year',
                                revenue: '$monthlyRevenue',
                            },
                        },
                    },
                },
                {
                    $project: {
                        roomId: '$_id',
                        monthlyRevenues: 1,
                        _id: 0,
                    },
                },
            ])

            res.status(200).json({
                message: 'Get data successfully',
                data: revenues,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Something went wrong',
            })
        }
    },

    getHotelRevenue: async (req: Request, res: Response) => {
        const { hotelId } = req.params

        // try {
        //     console.log(`Fetching revenue for hotelId: ${hotelId}`)

        //     const pipeline: any[] = [
        //         {
        //             $match: {
        //                 hotelId: new ObjectId(hotelId),
        //                 status: true,
        //             },
        //         },
        //         {
        //             $project: {
        //                 month: { $month: '$updatedAt' },
        //                 totalCost: '$totalCost',
        //             },
        //         },
        //         {
        //             $group: {
        //                 _id: { month: '$month' },
        //                 totalRevenue: { $sum: '$totalCost' },
        //             },
        //         },
        //         {
        //             $sort: { '_id.month': 1 },
        //         },
        //     ]

        //     const results = await Booking.aggregate<
        //         Document & { _id: { month: number }; totalRevenue: number }
        //     >(pipeline)

        //     const formattedResults = results.map((result) => ({
        //         month: result._id.month,
        //         totalRevenue: result.totalRevenue,
        //     }))

        //     res.status(200).json({
        //         message: 'Get hotel revenue successfully',
        //         data: formattedResults,
        //     })
        // } catch (error) {
        //     console.error('Failed to get hotel revenue:', error)
        //     res.status(500).json({
        //         message: 'Something went wrong',
        //     })
        // }
    },
}

export default StatisticsController
