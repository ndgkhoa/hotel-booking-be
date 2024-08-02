import express from 'express'
import verifyToken from '../middlewares/auth'
import ReceiptsController from '../controllers/ReceiptsController'
import { Request, Response } from 'express'
import crypto from 'crypto'

const router = express.Router()
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET!
//router.get('/', verifyToken, ReceiptsController.getReceiptsByUserId)
router.post('/:bookingId', verifyToken, ReceiptsController.createReceipt)

router.get('/payment/callback', (req: Request, res: Response) => {
    const vnpParams = req.query

    // Tạo chuỗi dữ liệu để mã hóa từ các tham số VNPay
    const vnpString = Object.keys(vnpParams)
        .filter(
            (key) => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType',
        )
        .sort()
        .map((key) => `${key}=${vnpParams[key]}`)
        .join('&')
    console.log('vnpString', vnpString)

    // Mã hóa dữ liệu để kiểm tra mã hash
    const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
    hmac.update(vnpString)
    const vnpSecureHash = hmac.digest('hex')
    const a = vnpParams.vnp_SecureHash
    // Kiểm tra mã hash
    if (vnpParams.vnp_SecureHash === vnpSecureHash) {
        // Mã hash hợp lệ, kiểm tra kết quả thanh toán
        if (vnpParams.vnp_ResponseCode === '00') {
            // Thanh toán thành công
            res.send('Thanh toán thành công!')
        } else {
            // Thanh toán thất bại
            res.send('Thanh toán thất bại!')
        }
    } else {
        // Mã hash không hợp lệ
        res.status(400).send({
            mess: 'Mã xác thực không hợp lệ!',
            vnpSecureHash,
            a,
        })
    }
})

export default router
