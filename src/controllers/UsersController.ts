import { Request, Response } from 'express'
import Hotel from '../models/hotel'
import User from '../models/user'
import _ from 'lodash'

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
            res.status(500).json({ message: 'Something went wrong' })
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
                data: userData,
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Failed to get all user' })
        }
    },

    getHotelFromUser: async (req: Request, res: Response) => {
        const id = req.params.id.toString()
        try {
            const hotel = await Hotel.findOne({ _id: id, userId: req.userId })
            res.json(hotel)
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hotels' })
        }
    },
}

export default UsersController
