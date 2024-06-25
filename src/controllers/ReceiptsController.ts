import { Request, Response } from 'express'
import Receipt from '../models/receipt'
import Stripe from 'stripe'
import Hotel from '../models/hotel'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        const { numberOfNights, paymentMethod } = req.body
        const hotelId = req.params.hotelId

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

            const newReceipt = new Receipt({
                paymentId: paymentIntent.id,
                paymentMethod: paymentMethod,
                date: new Date(),
                total: totalCost,
                userId: req.userId,
            })

            await newReceipt.save()

            res.status(201).json({
                message: 'Receipt created successfully',
                data: newReceipt,
            })
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default ReceiptsController
