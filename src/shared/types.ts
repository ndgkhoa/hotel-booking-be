export type AccountType = {
    _id: string
    userId: string
    username: string
    password: string
    role: string
}

export type UserType = {
    _id: string
    role: string
    birthday: string
    address: string
    phone: string
    email: string
    firstName: string
    lastName: string
}

export type CategoryType = {
    _id: string
    name: string
}

export type HotelType = {
    _id: string
    userId: string
    name: string
    city: string
    country: string
    description: string
    status: string
    categories: string
    starRating: number
    imageUrls: string[]
    lastUpdate: Date
}

export type RoomType = {
    _id: string
    hotelId: string
    name: string
    status: string
    adultCount: number
    childCount: number
    facilities: string[]
    pricePerNight: number
    imageUrls: string[]
}

export type HotelSearchResponse = {
    data: HotelType[]
    pagination: {
        total: number
        page: number
        pages: number
    }
}

export type ReceiptType = {
    _id: string
    date: Date
    total: number
    userId: string
    method: string
    coupon: string
}

export type BookingType = {
    _id: string
    checkIn: Date
    checkOut: Date
    date: Date
    status: string
    totalCost: number
    userId: string
    hotelId: string
}

export type BookingDetailType = {
    _id: string
    totalCost: number
    adultCount: number
    childCount: number
    hotelId: string
    receiptId: string
    bookingId: string
}
