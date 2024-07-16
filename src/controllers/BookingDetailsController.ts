import { Request, Response } from 'express'
import BookingDetail from '../models/bookingDetail'

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

    calculateMonthlyRevenue: async (req: Request, res: Response) => {
        // try {
        //     // Query booking details based on hotelId
        //     const bookingDetails = await BookingDetail.find({ hotelId });
        //     // Initialize an object to store revenue per room per month
        //     const revenueByRoom = {};
        //     // Process each booking detail
        //     for (const bookingDetail of bookingDetails) {
        //         // Extract receiptId
        //         const receiptId = bookingDetail.receiptId;
        //         // Query receipt to get createdAt
        //         const receipt = await Receipt.findById(receiptId);
        //         if (receipt) {
        //             // Get createdAt date and extract month
        //             const createdAt = new Date(receipt.createdAt);
        //             const month = createdAt.getMonth() + 1; // JavaScript months are 0-based
        //             // Calculate total revenue for this booking detail
        //             const revenue = bookingDetail.totalCost;
        //             // Initialize revenue for this room if it doesn't exist
        //             if (!revenueByRoom[bookingDetail.roomId]) {
        //                 revenueByRoom[bookingDetail.roomId] = {};
        //             }
        //             // Initialize revenue for this month if it doesn't exist
        //             if (!revenueByRoom[bookingDetail.roomId][month]) {
        //                 revenueByRoom[bookingDetail.roomId][month] = 0;
        //             }
        //             // Add revenue to existing revenue for this month and room
        //             revenueByRoom[bookingDetail.roomId][month] += revenue;
        //         }
        //     }
        //     // Log or return revenueByRoom object
        //     console.log('Revenue by room:', revenueByRoom);
        //     return revenueByRoom;
        // } catch (error) {
        //     console.error('Error calculating revenue:', error);
        //     throw error;
        // }
    },
}

export default BookingDetailsController
