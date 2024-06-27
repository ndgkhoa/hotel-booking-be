import { Request, Response } from 'express'
import Stripe from 'stripe'
import Booking from '../models/booking'
import Hotel from '../models/hotel'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const BookingsController = {
    booking: async (req: Request, res: Response) => {
        const { checkIn, checkOut, numberOfNights } = req.body
        const hotelId = req.params.hotelId
        const userId = req.userId

        try {
            const hotel = await Hotel.findById(hotelId)
            if (!hotel) {
                return res.status(400).json({ message: 'Hotel not found' })
            }

            const totalCost = hotel.pricePerNight * numberOfNights
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalCost * 100,
                currency: 'gbp',
                metadata: {
                    hotelId,
                    userId: req.userId,
                },
            })

            if (!paymentIntent.client_secret) {
                return res
                    .status(500)
                    .json({ message: 'Error creating payment intent' })
            }

            const newBooking = new Booking({
                checkIn,
                checkOut,
                status: 'Pending ',
                totalCost,
                userId,
                hotelId,
            })

            await newBooking.save()

            const response = {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret.toString(),
                totalCost,
            }
            res.send(response)
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default BookingsController
