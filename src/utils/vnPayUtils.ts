import crypto from 'crypto'
import { Request } from 'express'

const VNP_TMN_CODE = process.env.VNP_TMN_CODE!
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET!
const VNP_URL = process.env.VNP_URL!
const VNP_RETURN_URL = process.env.VNP_CALL_BACK + ''

const formatDateToVNPay = (date: Date) => {
    const gmtPlus7Offset = 7 * 60 * 60 * 1000
    const dateInGMTPlus7 = new Date(date.getTime() + gmtPlus7Offset)

    const year = dateInGMTPlus7.getFullYear().toString().padStart(4, '0')
    const month = (dateInGMTPlus7.getMonth() + 1).toString().padStart(2, '0')
    const day = dateInGMTPlus7.getDate().toString().padStart(2, '0')
    const hours = dateInGMTPlus7.getHours().toString().padStart(2, '0')
    const minutes = dateInGMTPlus7.getMinutes().toString().padStart(2, '0')
    const seconds = dateInGMTPlus7.getSeconds().toString().padStart(2, '0')

    return `${year}${month}${day}${hours}${minutes}${seconds}`
}

export const createVNPayPaymentUrl = (
    amount: number,
    orderId: string,
    req: Request,
) => {
    const vnpIpAddr = Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress ||
          'unknown'

    const vnpLocale = 'vn'

    const currentDate = new Date()
    const vnpExpireDate = new Date(currentDate.getTime() + 15 * 60 * 1000)

    const vnpParams: Record<string, string | number> = {
        vnp_Version: '2.0.0',
        vnp_TmnCode: VNP_TMN_CODE,
        vnp_Amount: amount * 23000,
        vnp_Command: 'pay',
        vnp_CreateDate: formatDateToVNPay(currentDate),
        vnp_CurrCode: 'VND',
        vnp_OrderInfo: `Order ${orderId}`,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: VNP_RETURN_URL,
        vnp_TxnRef: orderId,
        vnp_IpAddr: vnpIpAddr,
        vnp_Locale: vnpLocale,
        vnp_ExpireDate: formatDateToVNPay(vnpExpireDate),
    }

    const vnpString = Object.keys(vnpParams)
        .sort()
        .map((key) => `${key}=${vnpParams[key]}`)
        .join('&')

    const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
    hmac.update(vnpString)
    const vnpSecureHash = hmac.digest('hex')

    vnpParams.vnp_SecureHash = vnpSecureHash

    const vnpQuery = Object.keys(vnpParams)
        .map((key) => `${key}=${encodeURIComponent(vnpParams[key])}`)
        .join('&')

    return `${VNP_URL}?${vnpQuery}`
}
