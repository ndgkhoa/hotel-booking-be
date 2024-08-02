import { Request, Response } from 'express'
import Receipt from '../models/receipt'
import Room from '../models/room'
import BookingDetail from '../models/bookingDetail'
import Booking from '../models/booking'
import Stripe from 'stripe'
import { createVNPayPaymentUrl } from '../utils/vnPayUtils'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
    apiVersion: '2024-04-10',
})

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        const { totalCost, method, coupon } = req.body
        const userId = req.userId
        const bookingId = req.params.bookingId
        const paymentMethodId =
            method === 'stripe' ? req.body.paymentMethodId : null

        try {
            const booking = await Booking.findById(bookingId)
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' })
            }

            const roomId = booking.roomId
            const room = await Room.findById(roomId)
            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            booking.status = 'paid'
            booking.updatedAt = new Date() as any
            let checkOut: any = booking.checkOut
            if (!(checkOut instanceof Date)) {
                checkOut = new Date(checkOut)
            }
            await booking.save()

            room.status = false
            room.bookedLatest = checkOut
            await room.save()

            if (method === 'stripe') {
                if (!paymentMethodId) {
                    return res.status(400).json({
                        message:
                            'Payment method ID is required for Stripe payments',
                    })
                }

                try {
                    const paymentIntent = await stripe.paymentIntents.create({
                        amount: Math.round(totalCost * 100),
                        currency: 'gbp',
                        payment_method: paymentMethodId,
                        confirm: true,
                        return_url: process.env.FRONTEND_URL,
                    })

                    if (paymentIntent.status !== 'succeeded') {
                        return res.status(400).json({
                            message: 'Payment failed',
                            error: paymentIntent,
                        })
                    }
                } catch (error) {
                    console.error('Stripe Payment Error:', error)
                    return res
                        .status(500)
                        .json({ message: 'Payment processing error', error })
                }
            } else if (method === 'vnpay') {
                try {
                    const vnpayUrl = createVNPayPaymentUrl(
                        totalCost,
                        bookingId,
                        req,
                    )

                    res.status(200).json({
                        message: 'Redirecting to VNPay',
                        vnpayUrl,
                    })
                } catch (error) {
                    console.error('VNPay Payment Error:', error)
                    return res
                        .status(500)
                        .json({ message: 'Payment processing error', error })
                }
                return
            }

            const newReceipt = new Receipt({
                method,
                coupon,
                totalCost,
                userId,
            })
            await newReceipt.save()

            const newBookingDetail = new BookingDetail({
                totalCost,
                roomId,
                receiptId: newReceipt._id,
                bookingId,
            })
            await newBookingDetail.save()

            res.status(201).json({
                message: 'Receipt created successfully',
                data: newReceipt,
            })
        } catch (error) {
            console.error('General Error:', error)
            res.status(500).json({ message: 'Something went wrong', error })
        }
    },
}

export default ReceiptsController
