import { Request, Response } from 'express'
import { generateToken, setAuthTokenCookie } from '../utils/tokenUtils'
import { comparePasswords, hashPassword } from '../utils/bcryptUtils'

import Account from '../models/account'
import User from '../models/user'

const AuthController = {
    register: async (req: Request, res: Response) => {
        try {
            let existingUser = await User.findOne({
                username: req.body.username,
            })
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' })
            }

            let existingAccount = await Account.findOne({
                username: req.body.username,
            })
            if (existingAccount) {
                return res
                    .status(400)
                    .json({ message: 'Account already exists' })
            }

            const newUser = new User({
                role: 'Role_Customer',
                birthday: req.body.birthday,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            })
            await newUser.save()

            const hashedPassword = await hashPassword(req.body.password)
            const newAccount = new Account({
                userId: newUser.id,
                username: req.body.username,
                password: hashedPassword,
                role: newUser.role,
            })
            await newAccount.save()

            return res
                .status(200)
                .send({ message: 'User registered successfully' })
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
            const isMatch = await comparePasswords(password, account.password)
            if (!isMatch) {
                return res.status(400).json({ message: 'Password dont match' })
            }
            const token = generateToken(account.userId, account.role)
            setAuthTokenCookie(res, token)
            res.status(200).send({
                userId: account.userId,
                role: account.role,
                token: token,
            })
        } catch (error) {
            res.status(500).send({ message: 'Something went wrong' })
        }
    },

    verifyToken: async (req: Request, res: Response) => {
        res.status(200).send({ userId: req.userId, role: req.role })
    },

    logout: async (req: Request, res: Response) => {
        res.cookie('auth_token', '', {
            expires: new Date(0),
        })
        res.send()
    },
}
module.exports = AuthController
