import { Request, Response } from 'express'
import Hotel from '../models/hotel'
import Room from '../models/room'
import { HotelType } from '../shared/types'

interface HotelSearchResponse {
    data: any[]
    pagination: {
        total: number
        page: number
        pages: number
    }
}

const search = async (req: Request, res: Response) => {
    // try {
    //     const query = constructSearchQuery(req.query)
    //     console.log('Constructed Query:', query)
    //     let sortOptions: any = {}
    //     switch (req.query.sortOption) {
    //         case 'starRating':
    //             sortOptions = { starRating: -1 }
    //             break
    //         case 'pricePerNightAsc':
    //             sortOptions = { 'rooms.pricePerNight': 1 }
    //             break
    //         case 'pricePerNightDesc':
    //             sortOptions = { 'rooms.pricePerNight': -1 }
    //             break
    //         default:
    //             sortOptions = { starRating: -1 }
    //     }
    //     console.log('Sort Options:', sortOptions)
    //     const pageSize = 5
    //     const pageNumber = parseInt(
    //         req.query.page ? req.query.page.toString() : '1',
    //         10,
    //     )
    //     const skip = (pageNumber - 1) * pageSize
    //     console.log('Page Number:', pageNumber)
    //     console.log('Skip:', skip)
    //     const [hotels, total] = await Promise.all([
    //         Hotel.aggregate([
    //             {
    //                 $match: query,
    //             },
    //             { $sort: sortOptions },
    //             { $skip: skip },
    //             { $limit: pageSize },
    //         ]),
    //         Hotel.aggregate([{ $match: query }, { $count: 'total' }]),
    //     ])
    //     console.log('Hotels:', hotels)
    //     console.log('Total:', total)
    //     const totalHotels = total.length > 0 ? total[0].total : 0
    //     console.log('Total Hotels:', totalHotels)
    //     const response: HotelSearchResponse = {
    //         data: hotels,
    //         pagination: {
    //             total: totalHotels,
    //             page: pageNumber,
    //             pages: Math.ceil(totalHotels / pageSize),
    //         },
    //     }
    //     res.json(response)
    // } catch (error) {
    //     console.error('Error:', error)
    //     res.status(500).json({ message: 'Something went wrong' })
    // }
}

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {}

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, 'i') },
            { country: new RegExp(queryParams.destination, 'i') },
        ]
    }

    if (queryParams.adultCount) {
        constructedQuery['rooms.adultCount'] = {
            $gte: parseInt(queryParams.adultCount),
        }
    }

    if (queryParams.childCount) {
        constructedQuery['rooms.childCount'] = {
            $gte: parseInt(queryParams.childCount),
        }
    }

    if (queryParams.facilities) {
        constructedQuery['rooms.facilities'] = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        }
    }

    if (queryParams.categories) {
        constructedQuery['categories'] = {
            $in: Array.isArray(queryParams.categories)
                ? queryParams.categories
                : [queryParams.categories],
        }
    }

    if (queryParams.stars && Array.isArray(queryParams.stars)) {
        const starRatings = queryParams.stars.map((star: string) =>
            parseInt(star, 10),
        )
        constructedQuery['starRating'] = { $in: starRatings }
    } else if (queryParams.stars) {
        constructedQuery['starRating'] = {
            $eq: parseInt(queryParams.stars, 10),
        }
    }

    if (queryParams.maxPrice) {
        constructedQuery['rooms.pricePerNight'] = {
            $lte: parseInt(queryParams.maxPrice, 10),
        }
    }

    console.log('Constructed Query:', constructedQuery)
    return constructedQuery
}

export { search, constructSearchQuery }
