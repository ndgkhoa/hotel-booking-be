import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import { HotelType } from '../shared/types'
import Hotel from '../models/hotel'
import { validationResult } from 'express-validator'

const HotelsController = {
    createHotel: async (req: Request, res: Response) => {
        try {
            const existingHotel = await Hotel.findOne({ name: req.body.name })
            if (existingHotel) {
                return res
                    .status(400)
                    .json({ message: 'Hotel name already exists' })
            }
            const imageFiles = req.files as Express.Multer.File[]
            const newHotel: HotelType = req.body

            const imageUrls = await uploadImages(imageFiles)
            newHotel.imageUrls = imageUrls
            newHotel.createDate = new Date()
            newHotel.userId = req.userId
            newHotel.status = true

            const hotel = new Hotel(newHotel)
            await hotel.save()
            res.status(201).json({
                message: 'Hotel created successfully',
                data: newHotel,
            })
        } catch (error) {
            console.error('Error creating hotel:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getAllHotels: async (req: Request, res: Response) => {
        try {
            const hotels = await Hotel.find()
            res.status(200).json({
                message: 'Get data successfully',
                data: hotels,
            })
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ message: 'Error fetching hotels' })
        }
    },

    getHotel: async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const hotelId = req.params.hotelId
        try {
            const hotel = await Hotel.findById(hotelId)
            res.status(200).json({
                message: 'Get data successfully',
                data: hotel,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error fetching hotel' })
        }
    },

    getAllHotelsOfAuthor: async (req: Request, res: Response) => {
        try {
            const hotels = await Hotel.find({ userId: req.userId })
            res.status(200).json({
                message: 'Get data successfully',
                data: hotels,
            })
        } catch (error) {
            res.send(500).json({ message: 'Error fetching hotel' })
        }
    },

    updateHotel: async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body
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
            res.status(200).json({
                message: 'Update data successfully',
                data: hotel,
            })
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    ChangeStatus: async (req: Request, res: Response) => {
        const hotelId = req.params.hotelId
        const hotel = await Hotel.findById({ _id: hotelId })
        if (!hotel) return res.status(500).json({ message: 'Hotel not found' })
        hotel.status = !hotel.status
        hotel.save()
        return res
            .status(200)
            .json({ message: 'Status updated successfully', data: hotel })
    },
}

async function uploadImages(imageFiles: Express.Multer.File[]) {
    try {
        const uploadPromise = imageFiles.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString('base64')
            const dataURI = 'data:' + image.mimetype + ';base64,' + b64
            const res = await cloudinary.v2.uploader.upload(dataURI)
            return res.url
        })

        const imageUrls = await Promise.all(uploadPromise)
        return imageUrls
    } catch (error) {
        console.error('Error uploading images:', error)
        throw new Error('Image upload failed')
    }
}

export default HotelsController
