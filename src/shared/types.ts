export type AccountType = {
    _id: string
    email: string
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
    adultCount: number
    childCount: number
    facilities: string[]
    pricePerNight: number
    starRating: number
    imageUrls: string[]
    lastUpdate: Date
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
    paymentId: string
    paymentMethod: string
    date: Date
    total: number
    userId: string
}

export type PaymentIntentResponse = {
    paymentIntentId: string
    clientSecret: string
    totalCost: number
}

export type BookingType = {
    _id: string
    checkIn: Date
    checkOut: Date
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
