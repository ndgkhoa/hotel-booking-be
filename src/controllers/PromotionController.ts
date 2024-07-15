import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import Promotion from '../models/promotion'

const PromotionController = {
    createPromotion: async (req: Request, res: Response) => {
        const { name, discountPercentage, startDate, endDate } = req.body

        if (!name || !discountPercentage || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        try {
            const imageFile = req.file as Express.Multer.File
            const imageUrl = await uploadImage(imageFile)

            const newPromotion = new Promotion({
                name,
                discountPercentage,
                startDate,
                endDate,
                imageUrl,
                status: false,
            })

            await newPromotion.save()

            res.status(201).json({
                message: 'Promotion created successfully',
                data: newPromotion,
            })
        } catch (error) {
            console.error('Error creating promotion:', error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const promotions = await Promotion.find()
            res.status(200).json({
                message: 'Get data successfully',
                data: promotions,
            })
        } catch (error) {
            res.send(500).json({ message: 'Error fetching hotel' })
        }
    },

    changeStatus: async (req: Request, res: Response) => {
        const promotionId = req.params.promotionId
        const promotion = await Promotion.findById({ _id: promotionId })
        if (!promotion)
            return res.status(500).json({ message: 'Promotion not found' })
        promotion.status = !promotion.status
        promotion.save()
        return res
            .status(200)
            .json({ message: 'Status updated successfully', data: promotion })
    },
}

async function uploadImage(imageFile: Express.Multer.File) {
    try {
        const b64 = Buffer.from(imageFile.buffer).toString('base64')
        const dataURI = 'data:' + imageFile.mimetype + ';base64,' + b64
        const res = await cloudinary.v2.uploader.upload(dataURI)
        return res.url
    } catch (error) {
        console.error('Error uploading image:', error)
        throw new Error('Image upload failed')
    }
}

export default PromotionController
