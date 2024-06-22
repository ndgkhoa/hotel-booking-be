import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import { BookingType, HotelSearchResponse, HotelType } from '../shared/types'
import Hotel from '../models/hotel'
import { constructSearchQuery } from '../utils/searchQueryUtils'
import { validationResult } from 'express-validator'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const HotelsController = {
    createHotel: async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[]
            const newHotel: HotelType = req.body

            const imageUrls = await uploadImages(imageFiles)
            newHotel.imageUrls = imageUrls
            newHotel.lastUpdate = new Date()
            newHotel.userId = req.userId

            const hotel = new Hotel(newHotel)
            await hotel.save()
            res.status(201).send(hotel)
        } catch (error) {
            console.log('error creating hotel: ', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getHotel: async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const id = req.params.id.toString()
        try {
            const hotel = await Hotel.findById(id)
            res.json(hotel)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error fetching hotel' })
        }
    },

    getAllHotels: async (req: Request, res: Response) => {
        try {
            const hotels = await Hotel.find({ userId: req.userId })
            res.json(hotels)
        } catch (error) {
            res.send(500).json({ message: 'Error fetching hotel' })
        }
    },

    updateHotel: async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body
            updatedHotel.lastUpdate = new Date()
            const hotel = await Hotel.findByIdAndUpdate(
                {
                    _id: req.params.hotelId,
                    userId: req.userId,
                },
                updatedHotel,
                { new: true },
            )
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }
            const files = req.files as Express.Multer.File[]
            const updatedImageUrls = await uploadImages(files)
            hotel.imageUrls = [
                ...updatedImageUrls,
                ...(updatedHotel.imageUrls || []),
            ]
            await hotel.save()
            res.status(201).json(hotel)
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    search: async (req: Request, res: Response) => {
        try {
            const query = constructSearchQuery(req.query)

            let sortOptions: any = {}
            switch (req.query.sortOption) {
                case 'starRating':
                    sortOptions = { starRating: -1 }
                    break
                case 'pricePerNightAsc':
                    sortOptions = { pricePerNight: 1 }
                    break
                case 'pricePerNightDesc':
                    sortOptions = { pricePerNight: -1 }
                    break
            }

            const pageSize = 5
            const pageNumber = parseInt(
                req.query.page ? req.query.page.toString() : '1',
            )
            const skip = (pageNumber - 1) * pageSize

            const hotels = await Hotel.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(pageSize)
            const total = await Hotel.countDocuments(query)

            const response: HotelSearchResponse = {
                data: hotels,
                pagination: {
                    total,
                    page: pageNumber,
                    pages: Math.ceil(total / pageSize),
                },
            }

            res.json(response)
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    payment: async (req: Request, res: Response) => {
        const { numberOfNights } = req.body
        const hotelId = req.params.hotelId
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
        const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
        }
        res.send(response)
    },
    booking: async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId
            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string,
            )
            if (!paymentIntent) {
                return res
                    .status(400)
                    .json({ message: 'Payment intent not found' })
            }
            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res
                    .status(400)
                    .json({ message: 'Payment intent mismatch' })
            }
            if (paymentIntent.status !== 'succeeded') {
                return res.status(400).json({
                    message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
                })
            }
            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            }
            const hotel = await Hotel.findOneAndUpdate(
                {
                    _id: req.params.hotelId,
                },
                {
                    $push: { bookings: newBooking },
                },
            )
            if (!hotel) {
                return res.status(400).json({ message: 'Hotel not found' })
            }
            await hotel.save()
            res.status(200).send()
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromise = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64')
        let dataURI = 'data:' + image.mimetype + ';base64,' + b64
        const res = await cloudinary.v2.uploader.upload(dataURI)
        return res.url
    })

    const imageUrls = await Promise.all(uploadPromise)
    return imageUrls
}

export default HotelsController
