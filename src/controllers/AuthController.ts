import { Request, Response } from 'express'
import {
    generateToken,
    setAuthTokenHeader,
    newAccessToken,
} from '../utils/tokenUtils'
import { comparePasswords, hashPassword } from '../utils/bcryptUtils'

import Account from '../models/account'
import User from '../models/user'

const AuthController = {
    register: async (req: Request, res: Response) => {
        try {
            const {
                username,
                password,
                birthday,
                address,
                phone,
                email,
                firstName,
                lastName,
            } = req.body

            let existingAccount = await Account.findOne({ username })
            if (existingAccount) {
                return res
                    .status(400)
                    .json({ message: 'Account already exists' })
            }

            const newUser = new User({
                role: 'Role_Customer',
                birthday,
                address,
                phone,
                email,
                firstName,
                lastName,
                status: true,
            })
            await newUser.save()

            const hashedPassword = await hashPassword(password)
            const newAccount = new Account({
                userId: newUser._id,
                username,
                password: hashedPassword,
                role: newUser.role,
            })
            await newAccount.save()

            res.status(201).send({ message: 'User registered successfully' })
        } catch (error) {
            res.status(500).send({ message: 'Something went wrong' })
        }
    },

    login: async (req: Request, res: Response) => {
        const { username, password } = req.body
        try {
            const account = await Account.findOne({ username })
            if (!account) {
                return res.status(400).json({ message: 'Invalid Credentials' })
            }

            const userId = account.userId
            const user = await User.findOne({ _id: userId })
            if (!user?.status) {
                return res.status(403).json({ message: 'Account not active' })
            }

            const isMatch = await comparePasswords(password, account.password)
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: "Password doesn't match" })
            }

            const tokens = generateToken(
                account._id.toString(),
                account.userId,
                account.role,
            )
            setAuthTokenHeader(res, tokens)

            res.status(200).send({
                userId: account.userId,
                role: account.role,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            })
        } catch (error) {
            res.status(500).send({ message: 'Something went wrong' })
        }
    },

    verifyToken: async (req: Request, res: Response) => {
        res.status(200).send({
            accountId: req.accountId,
            userId: req.userId,
            role: req.role,
        })
    },

    refreshToken: async (req: Request, res: Response) => {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res
                .status(400)
                .json({ message: 'Refresh token is required' })
        }

        const tokens = newAccessToken(refreshToken)

        if (!tokens) {
            return res
                .status(401)
                .json({ message: 'Invalid or expired refresh token' })
        }

        res.status(200).json(tokens)
    },

    logout: async (req: Request, res: Response) => {
        res.setHeader('Authorization', '') // Xóa Authorization header
        res.status(200).send({ message: 'Logged out successfully' })
    },
}

module.exports = AuthController
