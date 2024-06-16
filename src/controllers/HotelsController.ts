import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import { HotelType } from '../shared/types'
import Hotel from '../models/hotel'

const HotelsController = {
    createHotel: async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[]
            const newHotel: HotelType = req.body

            const uploadPromise = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString('base64')
                let dataURI = 'data:' + image.mimetype + ';base64,' + b64
                const res = await cloudinary.v2.uploader.upload(dataURI)
                return res.url
            })

            const imageUrls = await Promise.all(uploadPromise)
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

    getAllHotels: async (req: Request, res: Response) => {
        try {
            const hotels = await Hotel.find({ userId: req.userId })
            res.json(hotels)
        } catch (error) {
            res.send(500).json({ message: 'Error fetching hotel' })
        }
    },
}

export default HotelsController
