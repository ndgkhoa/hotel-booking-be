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
    status: boolean
}

export type CategoryType = {
    _id: string
    name: string
}

export type HotelType = {
    _id: string
    supplierId: string
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
    bookedLatest: Date
    facilities: string[]
    pricePerNight: number
    imageUrls: string[]
    discountRate: Number
}

export type ReceiptType = {
    _id: string
    totalCost: number
    userId: string
    method: string
    coupon: string
}

export type BookingType = {
    _id: string
    checkIn: Date
    checkOut: Date
    adultCount: number
    childCount: number
    status: string
    totalCost: number
    userId: string
    roomId: string
    createdAt?: Date
    updatedAt?: Date
}

export type BookingDetailType = {
    _id: string
    totalCost: number
    roomId: string
    receiptId: string
    bookingId: string
    createdAt?: Date
    updatedAt?: Date
}

export type CouponType = {
    supplierId: string
    code: string
    type: 'percentage' | 'fixed'
    value: number
    expirationDate: Date
    isActive: boolean
}

export type CommentType = {
    hotelId: string
    userId: string
    content: string
    rating: number
    status: boolean
}
