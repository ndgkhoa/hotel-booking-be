import { Request, Response } from 'express'
import Booking from '../models/booking'
import BookingDetail from '../models/bookingDetail'
import Hotel from '../models/hotel'
import Room from '../models/room'
import Receipt from '../models/receipt'

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
            const supplierId = req.userId

            const hotels = await Hotel.find({ supplierId: supplierId })
                .select('_id')
                .exec()
            const hotelIds = hotels.map((hotel) => hotel._id.toString())

            const rooms = await Room.find({ hotelId: { $in: hotelIds } })
                .select('_id')
                .exec()
            const roomIds = rooms.map((room) => room._id.toString())

            const roomBookingCounts = await BookingDetail.aggregate([
                {
                    $match: {
                        roomId: { $in: roomIds },
                    },
                },
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

    getRoomRevenueOfSupplier: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId

            const hotels = await Hotel.find({ supplierId }).lean()
            if (hotels.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No hotels found for this supplier' })
            }

            const hotelIds = hotels.map((hotel) => hotel._id)

            const rooms = await Room.find({ hotelId: { $in: hotelIds } }).lean()
            if (rooms.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No rooms found for these hotels' })
            }

            const roomIds = rooms.map((room) => room._id)

            const bookingDetails = await BookingDetail.find({
                roomId: { $in: roomIds },
            }).lean()
            if (bookingDetails.length === 0) {
                return res.status(404).json({
                    message: 'No booking details found for these rooms',
                })
            }

            const receiptIds = bookingDetails.map((detail) => detail.receiptId)

            const receipts = await Receipt.find({
                _id: { $in: receiptIds },
            }).lean()
            if (receipts.length === 0) {
                return res.status(404).json({
                    message: 'No receipts found for these booking details',
                })
            }

            const revenueMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                const receipt = receipts.find(
                    (r) => r._id.toString() === detail.receiptId,
                )
                if (receipt) {
                    if (!revenueMap[detail.roomId]) {
                        revenueMap[detail.roomId] = 0
                    }
                    revenueMap[detail.roomId] += receipt.totalCost
                }
            })

            const roomRevenues = rooms.map((room) => ({
                roomId: room._id,
                name: room.name,
                revenue: revenueMap[room._id.toString()] || 0,
            }))

            res.status(200).json({
                message: 'Get data successfully',
                data: roomRevenues,
            })
        } catch (error) {
            console.error('Error fetching room revenue:', error)
            res.status(500).json({
                message: 'Something went wrong',
            })
        }
    },

    getHotelRevenue: async (req: Request, res: Response) => {
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
                    $match: {
                        'hotel._id': { $in: hotelIds },
                    },
                },
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

            return res.status(200).json({
                message: 'Get hotel revenue successfully',
                data: transformedData,
            })
        } catch (error) {
            console.error('Error getting hotel revenue:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    },

    getSuppliersRevenue: async (req: Request, res: Response) => {
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

            const monthlyRevenue = await BookingDetail.aggregate([
                {
                    $addFields: {
                        receiptObjectId: { $toObjectId: '$receiptId' },
                    },
                },
                {
                    $lookup: {
                        from: 'receipts',
                        localField: 'receiptObjectId',
                        foreignField: '_id',
                        as: 'receipt',
                    },
                },
                { $unwind: '$receipt' },
                {
                    $group: {
                        _id: {
                            year: { $year: '$receipt.createdAt' },
                            month: { $month: '$receipt.createdAt' },
                        },
                        totalRevenue: { $sum: '$totalCost' },
                    },
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1 },
                },
                {
                    $project: {
                        _id: 0,
                        time: {
                            year: '$_id.year',
                            month: '$_id.month',
                        },
                        totalRevenue: 1,
                    },
                },
            ])

            res.status(200).json({
                message: 'Get monthly revenue successfully',
                data: monthlyRevenue,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default StatisticsController
