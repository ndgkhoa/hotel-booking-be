import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import { HotelType } from '../shared/types'
import Hotel from '../models/hotel'

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
        const id = req.params.id.toString()
        try {
            const hotel = await Hotel.findOne({ _id: id, userId: req.userId })
            res.json(hotel)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hotels' })
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
