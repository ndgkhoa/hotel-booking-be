import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

interface BookingInfo {
    checkIn: string
    checkOut: string
    adultCount: number
    childCount: number
    totalCost: number
    bookingDate?: Date
    userName: string
}

const sendBookingConfirmation = (to: string, bookingInfo: BookingInfo) => {
    if (!bookingInfo.bookingDate) {
        console.error('Booking date is not provided.')
        return
    }

    const paymentDeadlineDate = new Date(bookingInfo.bookingDate)
    paymentDeadlineDate.setDate(paymentDeadlineDate.getDate() + 3)

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Booking Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #007BFF;">Booking Confirmation</h1>
                <p>Dear ${bookingInfo.userName},</p>
                <p>Your booking is confirmed. Here are the details:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Check-in:</strong> ${bookingInfo.checkIn}</li>
                    <li><strong>Check-out:</strong> ${bookingInfo.checkOut}</li>
                    <li><strong>Number of adults:</strong> ${bookingInfo.adultCount}</li>
                    <li><strong>Number of children:</strong> ${bookingInfo.childCount}</li>
                    <li><strong>Total cost:</strong> $${bookingInfo.totalCost}</li>
                    <li><strong>Booking date:</strong> ${bookingInfo.bookingDate.toISOString()}</li>
                </ul>
                <p>Please note that if the payment is not completed within 3 days from the booking date 
                (${paymentDeadlineDate.toDateString()}), your booking will be automatically canceled.</p>
                <p>Thank you for booking with us!</p>
                <p style="margin-top: 20px;">Best regards,<br>Your Hotel Team</p>
            </div>
        `,
    }

    return transporter.sendMail(mailOptions)
}

const sendConfirmationCode = (
    to: string,
    code: string,
): Promise<nodemailer.SentMessageInfo> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Supplier Registration Confirmation',
        html: `
            <p>Dear User,</p>
            <p>To complete your registration as a supplier, please use the following confirmation code:</p>
            <p style="font-weight: bold; font-size: 20px;">${code}</p>
            <p>Thank you for your patience!</p>
            <p>Best regards,</p>
            <p>Your Hotel Team</p>
        `,
    }

    return transporter.sendMail(mailOptions)
}

export { sendBookingConfirmation, BookingInfo, sendConfirmationCode }
