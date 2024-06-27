import { Request, Response } from 'express'
import Receipt from '../models/receipt'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const ReceiptsController = {
    createReceipt: async (req: Request, res: Response) => {
        try {
            const { paymentIntentId, totalCost } = req.body
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
                    return res.status(400).json({
                        message: 'Payment requires a valid payment method',
                    })
                } else {
                    return res.status(400).json({
                        message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
                    })
                }
            }

            const newReceipt = new Receipt({
                paymentId: paymentIntent.id,
                date: new Date(),
                total: totalCost,
                userId: req.userId,
            })

            await newReceipt.save()

            res.status(201).json({
                message: 'Booking created successfully',
                data: newReceipt,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default ReceiptsController
