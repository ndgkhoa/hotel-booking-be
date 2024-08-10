import { Request, Response } from 'express'
import Coupon from '../models/coupon'
import User from '../models/user'
import Booking from '../models/booking'
import Room from '../models/room'
import Hotel from '../models/hotel'

const CouponsController = {
    createCoupon: async (req: Request, res: Response) => {
        const { code, value, expirationDate } = req.body
        const supplierId = req.userId
        try {
            const supplier = await User.find({ supplierId })
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' })
            }
            const existingCoupon = await Coupon.findOne({ code })
            if (existingCoupon) {
                return res
                    .status(400)
                    .json({ message: 'Coupon code already exists' })
            }

            const newCoupon = new Coupon({
                supplierId,
                code,
                value,
                expirationDate,
            })
            await newCoupon.save()

            res.status(201).json({
                message: 'Coupon created successfully',
                data: newCoupon,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Error creating coupon', error })
        }
    },

    getSupplierCoupon: async (req: Request, res: Response) => {
        const supplierId = req.userId
        try {
            const supplier = await User.find({ supplierId })
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' })
            }
            const coupons = await Coupon.find({ supplierId })
            res.status(200).send({
                message: 'Get data successfully',
                data: coupons,
            })
        } catch (error) {
            console.error('Error fetching user:', error)
            res.status(500).send({ message: 'Failed to get data' })
        }
    },

    useCoupon: async (req: Request, res: Response) => {
        const { coupon, totalCost } = req.body
        const bookingId = req.params.bookingId

        try {
            if (!coupon) {
                return res.json({ data: totalCost })
            }

            if (totalCost === undefined) {
                return res.status(400).json({
                    message: 'Total cost are required',
                })
            }

            const foundCoupon = await Coupon.findOne({
                code: coupon,
                isActive: true,
                expirationDate: { $gte: new Date() },
            })

            if (!foundCoupon) {
                return res
                    .status(400)
                    .json({ message: 'Invalid or expired coupon' })
            }

            const foundBooking = await Booking.findById(bookingId)
            if (!foundBooking) {
                return res.status(404).json({ message: 'Booking not found' })
            }

            const foundRoom = await Room.findById(foundBooking.roomId)
            if (!foundRoom) {
                return res.status(404).json({ message: 'Room not found' })
            }

            const foundHotel = await Hotel.findById(foundRoom.hotelId)
            if (!foundHotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }

            let totalCostAfterDiscount = totalCost

            if (foundCoupon.supplierId === 'admin') {
                totalCostAfterDiscount -= (totalCost * foundCoupon.value) / 100
            } else {
                if (foundCoupon.supplierId !== foundHotel.supplierId) {
                    return res.status(400).json({
                        message: 'Coupon is not applicable to this hotel',
                        data: [foundCoupon.supplierId, foundHotel.supplierId],
                    })
                }
                totalCostAfterDiscount -= foundCoupon.value
            }

            totalCostAfterDiscount = Math.max(totalCostAfterDiscount, 0)

            res.json({ data: totalCostAfterDiscount })
        } catch (error) {
            console.error('Error applying coupon:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    },

    changeStatus: async (req: Request, res: Response) => {
        const couponId = req.params.couponId
        try {
            const coupon = await Coupon.findById(couponId)
            if (!coupon) {
                return res.status(404).json({ message: 'Coupon not found' })
            }
            coupon.isActive = !coupon.isActive
            await coupon.save()
            return res
                .status(200)
                .json({ message: 'Status updated successfully', data: coupon })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default CouponsController
