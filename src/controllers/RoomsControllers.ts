import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import Room from '../models/room'
import Hotel from '../models/hotel'
import { RoomType } from '../shared/types'
import Promotion from '../models/promotion'

const RoomsController = {
    createRoom: async (req: Request, res: Response) => {
        try {
            const hotelId = req.params.hotelId

            const existingHotel = await Hotel.findById(hotelId)
            if (!existingHotel) {
                return res.status(400).json({ message: 'Hotel does not exist' })
            }

            const imageFiles = req.files as Express.Multer.File[]
            const { name, facilities, adultCount, childCount, pricePerNight } =
                req.body

            const imageUrls = await uploadImages(imageFiles)

            const newRoom: Omit<RoomType, '_id'> = {
                hotelId,
                name,
                status: true,
                facilities,
                adultCount,
                childCount,
                pricePerNight,
                imageUrls,
                createDate: new Date(),
            }

            const room = new Room(newRoom)
            await room.save()

            if (
                existingHotel.smallestPrice == 0 ||
                pricePerNight < existingHotel.smallestPrice
            )
                existingHotel.smallestPrice = pricePerNight
            await existingHotel.save()

            res.status(201).json({
                message: 'Room created successfully',
                data: newRoom,
            })
        } catch (error) {
            console.error('Error creating room:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getRoom: async (req: Request, res: Response) => {
        try {
            const roomId = req.params.roomId
            const existingRoom = await Room.findById({ _id: roomId })
            if (!existingRoom)
                return res.status(400).json({ message: 'Room not found' })
            res.status(200).json({
                message: 'Get data successfully',
                data: existingRoom,
            })
        } catch (error) {
            res.send(500).json({ message: 'Error fetching hotel' })
        }
    },

    getAllRoomsOfHotel: async (req: Request, res: Response) => {
        try {
            const hotelId = req.params.hotelId
            const rooms = await Room.find({ hotelId })
            res.status(200).json({
                message: 'Get data successfully',
                data: rooms,
            })
        } catch (error) {
            res.send(500).json({ message: 'Error fetching hotel' })
        }
    },

    updateRoom: async (req: Request, res: Response) => {
        try {
            const updatedRoom: RoomType = req.body
            const room = await Room.findByIdAndUpdate(
                {
                    _id: req.params.roomId,
                },
                updatedRoom,
                { new: true },
            )
            if (!room) {
                return res.status(404).json({ message: 'Hotel not found' })
            }
            const files = req.files as Express.Multer.File[]
            const updatedImageUrls = await uploadImages(files)
            room.imageUrls = [
                ...updatedImageUrls,
                ...(updatedRoom.imageUrls || []),
            ]
            await room.save()
            res.status(200).json({
                message: 'Update data successfully',
                data: room,
            })
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    ChangeStatus: async (req: Request, res: Response) => {
        const roomId = req.params.roomId
        const room = await Room.findById({ _id: roomId })
        if (!room) return res.status(500).json({ message: 'Room not found' })
        room.status = !room.status
        room.save()
        return res
            .status(200)
            .json({ message: 'Status updated successfully', data: room })
    },

    getRoomWithPromotion: async (req: Request, res: Response) => {
        const { roomId } = req.params

        if (!roomId) {
            return res.status(400).json({ message: 'Room ID is required' })
        }

        try {
            const room = await Room.findById(roomId).lean()
            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            const currentDate = new Date()

            const activePromotions = await Promotion.find({
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
            }).lean()

            const finalPrice = activePromotions.reduce((price, promotion) => {
                return price * (1 - promotion.discountPercentage / 100)
            }, room.pricePerNight)

            res.status(200).json({
                message: 'Room details retrieved successfully',
                data: { ...room, finalPrice },
            })
        } catch (error) {
            console.error('Error retrieving room details:', error)
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
