import { Request, Response } from 'express'
import BookingDetail from '../models/bookingDetail'
import Hotel from '../models/hotel'
import Room from '../models/room'

const StatisticsController = {
    getMonthlySupplierRevenue: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

            const hotels = await Hotel.find({ supplierId }).lean()

            if (hotels.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No hotels found for this supplier' })
            }

            const hotelIds = hotels.map((hotel) => hotel._id.toString())

            const rooms = await Room.find({ hotelId: { $in: hotelIds } }).lean()

            if (rooms.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No rooms found for these hotels' })
            }

            const roomIds = rooms.map((room) => room._id.toString())

            const bookingDetails = await BookingDetail.find({
                roomId: { $in: roomIds },
            }).lean()

            if (bookingDetails.length === 0) {
                return res.status(404).json({
                    message: 'No booking details found for these rooms',
                })
            }

            const revenueMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                const createdAt = detail.createdAt
                    ? new Date(detail.createdAt.toString())
                    : new Date()
                const year = createdAt.getFullYear()
                const month = createdAt.getMonth() + 1

                const yearMonth = `${year}-${month.toString().padStart(2, '0')}`

                if (!revenueMap[yearMonth]) {
                    revenueMap[yearMonth] = 0
                }
                revenueMap[yearMonth] += detail.totalCost
            })

            const monthlyRevenue = Object.keys(revenueMap).map((yearMonth) => {
                const [year, month] = yearMonth.split('-')
                return {
                    year,
                    month,
                    revenue: revenueMap[yearMonth],
                }
            })

            res.status(200).json({
                message: 'Get supplier monthly revenue successfully',
                data: monthlyRevenue,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getHotelsRevenueBySupplier: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

            const hotels = await Hotel.find({ supplierId }).lean()

            if (hotels.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No hotels found for this supplier' })
            }

            const hotelIds = hotels.map((hotel) => hotel._id.toString())

            const rooms = await Room.find({ hotelId: { $in: hotelIds } }).lean()

            if (rooms.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No rooms found for these hotels' })
            }

            const roomIds = rooms.map((room) => room._id.toString())

            const bookingDetails = await BookingDetail.find({
                roomId: { $in: roomIds },
            }).lean()

            if (bookingDetails.length === 0) {
                return res.status(404).json({
                    message: 'No booking details found for these rooms',
                })
            }

            const revenueRoomMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                if (!revenueRoomMap[detail.roomId]) {
                    revenueRoomMap[detail.roomId] = 0
                }
                revenueRoomMap[detail.roomId] += detail.totalCost
            })

            const revenueHotelMap: Record<string, number> = {}

            rooms.forEach((room) => {
                if (!revenueHotelMap[room.hotelId]) {
                    revenueHotelMap[room.hotelId] = 0
                }
                revenueHotelMap[room.hotelId] +=
                    revenueRoomMap[room._id.toString()] || 0
            })

            const hotelRevenue = hotels.map((hotel) => ({
                hotelId: hotel._id,
                name: hotel.name,
                revenue: revenueHotelMap[hotel._id.toString()] || 0,
            }))

            return res.status(200).json({
                message: 'Get hotel revenue successfully',
                data: hotelRevenue,
            })
        } catch (error) {
            console.error('Error getting hotel revenue:', error)
            return res.status(500).json({ message: 'Internal server error' })
        }
    },

    getMonthlyHotelRevenue: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId
            const hotelId = req.params.hotelId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

            if (!hotelId) {
                return res
                    .status(400)
                    .json({ message: 'Hotel ID param is required' })
            }

            const hotel = await Hotel.findById(hotelId).lean()

            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }

            if (hotel.supplierId !== supplierId) {
                return res.status(404).json({
                    message: 'You do not have permission to access this hotel',
                })
            }

            const rooms = await Room.find({ hotelId }).lean()

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

            const revenueMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                const createdAt = detail.createdAt
                    ? new Date(detail.createdAt.toString())
                    : new Date()
                const year = createdAt.getFullYear()
                const month = createdAt.getMonth() + 1

                const yearMonth = `${year}-${month.toString().padStart(2, '0')}`

                if (!revenueMap[yearMonth]) {
                    revenueMap[yearMonth] = 0
                }
                revenueMap[yearMonth] += detail.totalCost
            })

            const monthlyRevenue = Object.keys(revenueMap).map((yearMonth) => {
                const [year, month] = yearMonth.split('-')
                return {
                    year,
                    month,
                    revenue: revenueMap[yearMonth],
                }
            })

            res.status(200).json({
                message: 'Get hotel monthly revenue successfully',
                data: monthlyRevenue,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getRoomsRevenueBySupplier: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

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

            const revenueMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                if (!revenueMap[detail.roomId]) {
                    revenueMap[detail.roomId] = 0
                }
                revenueMap[detail.roomId] += detail.totalCost
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

    getRoomsRevenueOfHotelBySupplier: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId
            const hotelId = req.params.hotelId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

            if (!hotelId) {
                return res
                    .status(400)
                    .json({ message: 'Hotel ID param is required' })
            }

            const hotel = await Hotel.findById(hotelId).lean()

            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }

            if (hotel.supplierId !== supplierId) {
                return res.status(404).json({
                    message: 'You do not have permission to access this hotel',
                })
            }

            const rooms = await Room.find({ hotelId }).lean()

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

            const revenueMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                if (!revenueMap[detail.roomId]) {
                    revenueMap[detail.roomId] = 0
                }
                revenueMap[detail.roomId] += detail.totalCost
            })

            const result = rooms.map((room) => ({
                roomId: room._id,
                name: room.name,
                revenue: revenueMap[room._id],
            }))

            res.status(200).json({
                message: 'Get data successfully',
                data: result,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getDailyRoomRevenue: async (req: Request, res: Response) => {
        try {
            const supplierId = req.userId
            const roomId = req.params.roomId

            if (!supplierId) {
                return res
                    .status(400)
                    .json({ message: 'Supplier ID is required' })
            }

            if (!roomId) {
                return res
                    .status(400)
                    .json({ message: 'Room ID param is required' })
            }

            const room = await Room.findById(roomId).lean()

            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            const hotelId = room.hotelId
            const hotel = await Hotel.findById(hotelId).lean()

            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }

            if (supplierId !== hotel?.supplierId) {
                return res.status(404).json({
                    message: 'You do not have permission to access this room',
                })
            }

            const bookingDetails = await BookingDetail.find({ roomId }).lean()

            if (bookingDetails.length === 0) {
                return res.status(404).json({
                    message: 'No booking details found for these rooms',
                })
            }

            const revenueMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                const createdAt = detail.createdAt
                    ? new Date(detail.createdAt.toString())
                    : new Date()
                const year = createdAt.getFullYear()
                const month = createdAt.getMonth() + 1
                const day = createdAt.getDate()

                const yearMonthDay = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

                if (!revenueMap[yearMonthDay]) {
                    revenueMap[yearMonthDay] = 0
                }
                revenueMap[yearMonthDay] += detail.totalCost
            })

            const dailyRevenue = Object.keys(revenueMap).map((yearMonthDay) => {
                const [year, month, day] = yearMonthDay.split('-')
                return {
                    year,
                    month,
                    day,
                    revenue: revenueMap[yearMonthDay],
                }
            })

            res.status(200).json({
                message: 'Get hotel monthly revenue successfully',
                data: dailyRevenue,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getTotalCostOfRoom: async (req: Request, res: Response) => {
        const { roomId } = req.params
        if (!roomId) {
            return res.status(400).json({ message: 'Room ID is required' })
        }
        try {
            const bookingDetails = await BookingDetail.find({ roomId }).lean()
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

            const countMap: Record<string, number> = {}

            bookingDetails.forEach((detail) => {
                if (!countMap[detail.roomId]) {
                    countMap[detail.roomId] = 0
                }
                countMap[detail.roomId] += 1
            })

            const roomBookingCount = rooms.map((room) => ({
                roomId: room._id,
                name: room.name,
                count: countMap[room._id.toString()] || 0,
            }))

            res.status(200).json({
                message: 'Room booking counts retrieved successfully',
                data: roomBookingCount,
            })
        } catch (error) {
            console.error('Error retrieving room booking counts:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default StatisticsController
