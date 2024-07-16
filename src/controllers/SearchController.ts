import { Request, Response } from 'express'
import Hotel from '../models/hotel'
import Room from '../models/room'

const search = async (req: Request, res: Response) => {
    try {
        const {
            hotelName,
            city,
            country,
            minStarRating,
            maxPrice,
            adultCount,
            childCount,
            categories,
            facilities,
            page = 1,
            limit = 5,
            sortOption,
        } = req.query

        const hotelQuery: any = {}
        const roomQuery: any = {}

        if (hotelName) {
            hotelQuery.name = { $regex: hotelName, $options: 'i' }
        }
        if (city || country) {
            const destinationQuery: any[] = []
            if (city) {
                destinationQuery.push({ city: { $regex: city, $options: 'i' } })
            }
            if (country) {
                destinationQuery.push({
                    country: { $regex: country, $options: 'i' },
                })
            }
            hotelQuery.$or = destinationQuery
        }
        if (minStarRating) {
            hotelQuery.starRating = { $gte: parseInt(minStarRating as string) }
        }
        if (categories) {
            hotelQuery.categories = { $regex: categories, $options: 'i' }
        }

        if (facilities) {
            const facilitiesArray = Array.isArray(facilities)
                ? facilities
                : [facilities]
            roomQuery.facilities = { $all: facilitiesArray }
        }
        if (maxPrice) {
            roomQuery.pricePerNight = { $lte: parseInt(maxPrice as string) }
        }
        if (adultCount) {
            roomQuery.adultCount = { $gte: parseInt(adultCount as string) }
        }
        if (childCount) {
            roomQuery.childCount = { $gte: parseInt(childCount as string) }
        }

        let sortOptions: any = {}

        switch (sortOption) {
            case 'starRating':
                sortOptions = { starRating: -1 }
                break
            case 'pricePerNightAsc':
                sortOptions = { 'rooms.pricePerNight': 1 }
                break
            case 'pricePerNightDesc':
                sortOptions = { 'rooms.pricePerNight': -1 }
                break
            default:
                sortOptions = { starRating: -1 }
                break
        }

        const hotels = await Hotel.find(hotelQuery)
        const hotelIds = hotels.map((hotel) => hotel._id)
        roomQuery.hotelId = { $in: hotelIds }

        const rooms = await Room.find(roomQuery)
            .skip((parseInt(page as string) - 1) * parseInt(limit as string))
            .limit(parseInt(limit as string))
            .sort(sortOptions)

        const result = hotels.map((hotel) => {
            const hotelRooms = rooms.filter(
                (room) => room.hotelId.toString() === hotel._id.toString(),
            )
            return {
                hotel,
                rooms: hotelRooms,
            }
        })

        res.json({
            message: 'Get data successfully',
            data: result,
            pagination: {
                total: result.length,
                page: parseInt(page as string),
                pages: Math.ceil(result.length / parseInt(limit as string)),
            },
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error searching hotels and rooms',
            error,
        })
    }
}

export { search }
