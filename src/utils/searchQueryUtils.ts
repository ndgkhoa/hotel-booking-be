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

    if (queryParams.categories) {
        constructedQuery.categories = {
            $in: Array.isArray(queryParams.categories)
                ? queryParams.categories
                : [queryParams.categories],
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
