import { Request, Response } from 'express'
import BookingDetail from '../models/bookingDetail'

const BookingDetailsController = {
    createDetail: async (req: Request, res: Response) => {
        const {
            totalCost,
            adultCount,
            childCount,
            hotelId,
            receiptId,
            bookingId,
        } = req.body

        if (
            !totalCost ||
            !adultCount ||
            !childCount ||
            !hotelId ||
            !receiptId ||
            !bookingId
        ) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        try {
            const newBookingDetail = new BookingDetail({
                totalCost,
                adultCount,
                childCount,
                hotelId,
                receiptId,
                bookingId,
            })

            await newBookingDetail.save()

            res.status(201).json({
                message: 'Booking detail created successfully',
                bookingDetail: newBookingDetail,
            })
        } catch (error) {
            console.error('Error creating booking detail:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getAllDetails: async (req: Request, res: Response) => {
        try {
            const bookingDetails = await BookingDetail.find().lean()
            res.status(200).json({
                message: 'All booking details retrieved successfully',
                data: bookingDetails,
            })
        } catch (error) {
            console.error('Error retrieving booking details:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingDetailsController
