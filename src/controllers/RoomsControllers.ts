import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import Room from '../models/room'
import Hotel from '../models/hotel'
import { RoomType } from '../shared/types'

const RoomsController = {
    createRoom: async (req: Request, res: Response) => {
        try {
            const hotelId = req.params.hotelId as string

            const existingHotel = await Hotel.findById(hotelId)
            if (!existingHotel) {
                return res.status(400).json({ message: 'Hotel does not exist' })
            }

            const imageFiles = req.files as Express.Multer.File[]
            const {
                name,
                status,
                facilities,
                adultCount,
                childCount,
                pricePerNight,
            } = req.body

            const imageUrls = await uploadImages(imageFiles)

            const newRoom: Omit<RoomType, '_id'> = {
                hotelId,
                name,
                status: status || 'Available',
                facilities,
                adultCount,
                childCount,
                pricePerNight,
                imageUrls,
            }

            const room = new Room(newRoom)
            await room.save()

            res.status(201).json({
                message: 'Room created successfully',
                roomId: room._id,
            })
        } catch (error) {
            console.error('Error creating room:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
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

export default RoomsController
