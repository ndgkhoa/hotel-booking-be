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
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Booking Confirmation',
        text: `Dear ${bookingInfo.userName},

Your booking is confirmed. Here are the details:
- Check-in: ${bookingInfo.checkIn}
- Check-out: ${bookingInfo.checkOut}
- Number of adults: ${bookingInfo.adultCount}
- Number of children: ${bookingInfo.childCount}
- Total cost: $${bookingInfo.totalCost}
- Booking date: ${bookingInfo.bookingDate?.toISOString()}

Thank you for booking with us!

Best regards,
Your Hotel Team`,
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
