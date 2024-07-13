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
            const user = await User.findByIdAndUpdate(
                userId,
                { role: 'Role_Supplier' },
                { new: true },
            )

            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            res.status(200).json({
                message: 'User has become a supplier successfully',
                data: user,
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },
}

export default UsersController
