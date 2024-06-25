import { Request, Response } from 'express'
import Stripe from 'stripe'
import Booking from '../models/booking'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const BookingsController = {
    booking: async (req: Request, res: Response) => {
        try {
            const { paymentIntentId, checkIn, checkOut, totalCost, status } =
                req.body
            const hotelId = req.params.hotelId
            const userId = req.userId

            const paymentIntent =
                await stripe.paymentIntents.retrieve(paymentIntentId)
            if (!paymentIntent) {
                return res
                    .status(400)
                    .json({ message: 'Payment intent not found' })
            }

            if (
                paymentIntent.metadata.hotelId !== hotelId ||
                paymentIntent.metadata.userId !== userId
            ) {
                return res
                    .status(400)
                    .json({ message: 'Payment intent mismatch' })
            }

            if (paymentIntent.status !== 'succeeded') {
                if (paymentIntent.status === 'requires_payment_method') {
                    return res
                        .status(400)
                        .json({
                            message: 'Payment requires a valid payment method',
                        })
                } else {
                    return res
                        .status(400)
                        .json({
                            message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
                        })
                }
            }

            const newBooking = new Booking({
                checkIn,
                checkOut,
                status,
                totalCost,
                userId,
                hotelId,
            })

            await newBooking.save()

            res.status(201).json({
                message: 'Booking created successfully',
                data: newBooking,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingsController
