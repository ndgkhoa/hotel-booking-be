import { Request, Response } from 'express'
import User from '../models/user'
import { generateToken, setAuthTokenCookie } from '../utils/tokenUtils'
import { comparePasswords, hashPassword } from '../utils/bcryptUtils'
import { validationResult } from 'express-validator'
import _ from 'lodash'

const AuthController = {
    registerUser: async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        try {
            let user = await User.findOne({
                email: req.body.email,
            })

            if (user) {
                return res.status(400).json({ message: 'User already exists' })
            }

            const hashedPassword = await hashPassword(req.body.password)
            user = new User({
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            })

            await user.save()

            const token = generateToken(user.id)

            setAuthTokenCookie(res, token)

            return res
                .status(200)
                .send({ message: 'Account created successfully' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Something went wrong' })
        }
    },

    verifyToken: async (req: Request, res: Response) => {
        res.status(200).send({ userId: req.userId })
    },

    loginUser: async (req: Request, res: Response) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        const { email, password } = req.body
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials' })
            }
            const isMatch = comparePasswords(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: 'Password dont match' })
            }
            const token = generateToken(user.id)
            setAuthTokenCookie(res, token)
            res.status(200).send({ userId: user.id })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Something went wrong' })
        }
    },

    getAllUser: async (req: Request, res: Response) => {
        try {
            const users = await User.find().lean()
            const userData = users.map((user) =>
                _.omit(user, ['password', '__v']),
            )

            res.status(200).send({
                message: 'Get all users successfully',
                users: userData,
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Failed to get all user' })
        }
    },

    logout: async (req: Request, res: Response) => {
        res.cookie('auth_token', '', {
            expires: new Date(0),
        })
        res.send()
    },
}
module.exports = AuthController
