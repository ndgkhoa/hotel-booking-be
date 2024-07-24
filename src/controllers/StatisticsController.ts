import { Request, Response } from 'express'
import Booking from '../models/booking' // Assuming your Mongoose model for bookings
import BookingDetail from '../models/bookingDetail' // Assuming your Mongoose model for booking details
import Hotel from '../models/hotel'

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
        try {
            const bookings = await Booking.aggregate([
                {
                    $addFields: {
                        convertedRoomId: { $toObjectId: '$roomId' },
                    },
                },
                {
                    $lookup: {
                        from: 'rooms',
                        localField: 'convertedRoomId',
                        foreignField: '_id',
                        as: 'room',
                    },
                },
                { $unwind: '$room' },
                {
                    $addFields: {
                        convertedHotelId: { $toObjectId: '$room.hotelId' },
                    },
                },
                {
                    $lookup: {
                        from: 'hotels',
                        localField: 'convertedHotelId',
                        foreignField: '_id',
                        as: 'hotel',
                    },
                },
                { $unwind: '$hotel' },
                {
                    $project: {
                        data: {
                            hotelId: '$hotel._id',
                            hotelName: '$hotel.name',
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        totalRevenue: '$totalCost',
                    },
                },
                {
                    $group: {
                        _id: '$data',
                        totalRevenue: { $sum: '$totalRevenue' },
                    },
                },
                {
                    $sort: {
                        '_id.hotelId': 1,
                        '_id.year': 1,
                        '_id.month': 1,
                    },
                },
            ])

            const transformedData = bookings.map((item) => ({
                data: item._id,
                totalRevenue: item.totalRevenue,
            }))

            return res.status(200).json(transformedData)
        } catch (error) {
            console.error('Error getting hotel revenue:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    },

    getSuppliersRevenue: async (req: Request, res: Response) => {},
}

export default StatisticsController