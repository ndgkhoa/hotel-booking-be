import { Date } from 'mongoose'

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
    status: boolean
    categories: string
    starRating: number
    imageUrls: string[]
}

export type RoomType = {
    _id: string
    hotelId: string
    name: string
    status: boolean
    adultCount: number
    childCount: number
    bookedTime: number
    bookedLastest: Date | null
    facilities: string[]
    pricePerNight: number
    imageUrls: string[]
}

export type ReceiptType = {
    _id: string
    date: Date
    totalCost: number
    userId: string
    method: string
    coupon: string
}

export type BookingType = {
    _id: string
    checkIn: Date
    checkOut: Date
    bookingDate: Date
    adultCount: number
    childCount: number
    status: boolean
    totalCost: number
    userId: string
    roomId: string
}

export type BookingDetailType = {
    _id: string
    totalCost: number
    roomId: string
    receiptId: string
    bookingId: string
}

export type CouponType = {
    code: string
    type: 'percentage' | 'fixed'
    value: number
    expirationDate: Date
    isActive: boolean
}
