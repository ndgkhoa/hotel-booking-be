import Account from '../models/account'
import { Request, Response } from 'express'
import { hashPassword } from '../utils/bcryptUtils'
import User from '../models/user'

const AccountController = {
    changePassword: async (req: Request, res: Response) => {
        try {
            const { newPassword } = req.body
            if (!newPassword) {
                return res
                    .status(400)
                    .json({ message: 'New password is required' })
            }
            const hashedPassword = await hashPassword(newPassword)
            const updatedAccount = await Account.findByIdAndUpdate(
                { _id: req.params.accountId, userId: req.userId },
                { password: hashedPassword },
                { new: true },
            )
            if (!updatedAccount) {
                return res.status(404).json({ message: 'Account not found' })
            }
            res.status(200).json({
                message: 'Password updated successfully',
                data: updatedAccount,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    getInfo: async (req: Request, res: Response) => {
        try {
            const userId = req.userId
            const accountId = req.accountId

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' })
            }

            if (!accountId) {
                return res
                    .status(400)
                    .json({ message: 'Account ID is required' })
            }

            const user = await User.findById({ _id: userId })
            const account = await Account.findById({ _id: accountId })

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            if (!account) {
                return res.status(404).json({ message: 'Account not found' })
            }

            const info = {
                role: user.role,
                birthday: user.birthday,
                address: user.address,
                phone: user.phone,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: account.username,
                password: account.password,
            }
            return res
                .status(200)
                .json({ message: 'Password updated successfully', data: info })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    
}

module.exports = AccountController
