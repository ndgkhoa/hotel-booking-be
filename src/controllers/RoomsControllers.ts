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

            const existingRoom = await Room.findOne({ name: req.body.name })
            if (existingRoom) {
                return res
                    .status(400)
                    .json({ message: 'Room name already exists' })
            }

            const imageUrls = await uploadImages(imageFiles)

            const newRoom = new Room({
                hotelId,
                name,
                status: true,
                facilities,
                adultCount,
                childCount,
                pricePerNight,
                imageUrls,
                bookedTime: 0,
                bookedLatest: null,
                discountRate: 0,
            })

            await newRoom.save()

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
            const rooms = await Room.find({ hotelId }).lean()

            if (rooms.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No rooms found for this hotel' })
            }

            const currentDate = new Date()

            const activePromotions = await Promotion.find({
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
                status: true,
            }).lean()

            let maxDiscountPromotion = null

            if (activePromotions.length > 0) {
                maxDiscountPromotion = activePromotions.reduce(
                    (max, promotion) => {
                        return promotion.discountPercentage >
                            max.discountPercentage
                            ? promotion
                            : max
                    },
                )
            }

            const roomsWithFinalPrice = rooms.map((room) => {
                let discountRate = 0
                let finalPrice = room.pricePerNight

                if (maxDiscountPromotion) {
                    discountRate =
                        1 - maxDiscountPromotion.discountPercentage / 100
                    finalPrice = room.pricePerNight * discountRate
                }

                return { ...room, finalPrice, discountRate }
            })

            for (const room of roomsWithFinalPrice) {
                await Room.findByIdAndUpdate(room._id, {
                    discountRate: room.discountRate,
                })
            }

            res.status(200).json({
                message: 'Get data successfully',
                data: roomsWithFinalPrice,
            })
        } catch (error) {
            console.error('Error fetching hotel rooms:', error)
            res.status(500).json({ message: 'Error fetching hotel rooms' })
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

    changeStatus: async (req: Request, res: Response) => {
        const roomId = req.params.roomId
        const room = await Room.findById({ _id: roomId })
        if (!room) return res.status(500).json({ message: 'Room not found' })
        room.status = !room.status
        room.save()
        return res
            .status(200)
            .json({ message: 'Status updated successfully', data: room })
    },

    resetStatus: async (req: Request, res: Response) => {
        const hotelId = req.params.hotelId

        try {
            const rooms = await Room.find({ hotelId })

            const currentTime = new Date()
            for (const room of rooms) {
                if (room.bookedLatest) {
                    const bookedLastest = new Date(room.bookedLatest as any)
                    const timeDifference =
                        bookedLastest.getTime() - currentTime.getTime()
                    const hoursDifference = Math.ceil(
                        timeDifference / (1000 * 60 * 60),
                    )
                    room.bookedTime = hoursDifference

                    if (hoursDifference <= 0) {
                        room.status = true
                    } else room.status = false
                }

                await room.save()
            }

            res.status(200).json({
                message: 'Rooms status reset successfully',
                data: rooms,
            })
        } catch (error) {
            console.error('Error resetting room status:', error)
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
