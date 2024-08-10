import { Request, Response } from 'express'
import Hotel from '../models/hotel'
import User from '../models/user'
import _ from 'lodash'
import { sendConfirmationCode } from '../utils/mailer'
import Account from '../models/account'
import { generateRandomCode } from '../utils/randomCodeUtils'

const UsersController = {
    getUser: async (req: Request, res: Response) => {
        const userId = req.userId

        try {
            const user = await User.findById(userId).select('-password')
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'User not found', data: req.userId })
            }
            res.json(user)
        } catch (error) {
            console.error('Error fetching user:', error)
            res.status(500).send({ message: 'Failed to get data' })
        }
    },

    getAllUser: async (req: Request, res: Response) => {
        try {
            const users = await User.find().lean()
            const userData = users.map((user) =>
                _.omit(user, ['password', '__v']),
            )

            res.status(200).send({
                message: 'Get data successfully',
                data: userData,
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Failed to get data' })
        }
    },

    getHotelFromUser: async (req: Request, res: Response) => {
        const id = req.params.id.toString()
        try {
            const hotels = await Hotel.findOne({ _id: id, userId: req.userId })
            res.status(200).send({
                message: 'Get data successfully',
                data: hotels,
            })
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hotels' })
        }
    },

    becomeSupplier: async (req: Request, res: Response) => {
        const userId = req.userId
        try {
            const user = await User.findById(userId)

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const confirmationCode = generateRandomCode(8)

            res.cookie(`confirmation_code_${userId}`, confirmationCode, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
            })

            await sendConfirmationCode(user.email, confirmationCode)

            res.status(200).json({
                message:
                    'Confirmation code sent to your email. Please check your email to complete the supplier registration.',
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    verifySupplierCode: async (req: Request, res: Response) => {
        const { code } = req.body
        const userId = req.userId
        const storedCode = req.cookies[`confirmation_code_${userId}`]

        try {
            if (storedCode !== code) {
                return res
                    .status(400)
                    .json({ message: 'Invalid confirmation code' })
            }

            res.clearCookie(`confirmation_code_${userId}`)

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { role: 'Role_Supplier' },
                { new: true },
            )

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' })
            }

            const updatedAccount = await Account.findOneAndUpdate(
                { userId },
                { role: 'Role_Supplier' },
                { new: true },
            )

            if (!updatedAccount) {
                return res.status(404).json({ message: 'Account not found' })
            }

            res.status(200).json({
                message: 'You have successfully become a supplier.',
                data: updatedUser,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    changeStatus: async (req: Request, res: Response) => {
        const userId = req.params.userId
        try {
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            user.status = !user.status
            await user.save()

            if (user.role === 'Role_Supplier') {
                await Hotel.updateMany(
                    { supplierId: userId },
                    { $set: { isActive: false } },
                )
            }

            res.status(200).json({
                message: 'Status updated successfully',
                data: user,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default UsersController
