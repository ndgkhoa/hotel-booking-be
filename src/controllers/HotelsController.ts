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
            newHotel.status = 'Vacant'

            const hotel = new Hotel(newHotel)
            await hotel.save()
            res.status(201).json({ message: 'Hotel created successfully' })
        } catch (error) {
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
