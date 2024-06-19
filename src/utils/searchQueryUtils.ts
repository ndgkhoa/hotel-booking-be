export const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {}

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, 'i') },
            { country: new RegExp(queryParams.destination, 'i') },
        ]
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        }
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        }
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        }
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        }
    }

    if (queryParams.stars && Array.isArray(queryParams.stars)) {
        const starRatings = queryParams.stars.map((star: string) =>
            parseInt(star),
        )
        constructedQuery.starRating = { $in: starRatings }
    } else if (queryParams.stars) {
        constructedQuery.starRating = { $eq: parseInt(queryParams.stars) }
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        }
    }

    return constructedQuery
}
