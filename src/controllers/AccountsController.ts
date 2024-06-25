import Account from '../models/account'
import { Request, Response } from 'express'
import { hashPassword } from '../utils/bcryptUtils'

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
                account: updatedAccount,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

module.exports = AccountController
