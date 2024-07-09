import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import Promotion from '../models/promotion'

const PromotionController = {
    createPromotion: async (req: Request, res: Response) => {
        const {
            name,
            discountPercentage,
            startDate,
            endDate,
            status,
            hotelId,
        } = req.body

        if (
            !name ||
            !discountPercentage ||
            !startDate ||
            !endDate ||
            !status ||
            !hotelId
        ) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        try {
            const imageFile = req.file as Express.Multer.File
            const imageUrl = await uploadImage(imageFile)

            const newPromotion = new Promotion({
                hotelId,
                name,
                discountPercentage,
                startDate,
                endDate,
                imageUrl,
                status,
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
