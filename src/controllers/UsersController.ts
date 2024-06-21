import { Request, Response } from 'express'
import Hotel from '../models/hotel'
import User from '../models/user'

const UsersController = {
    getUser: async (req: Request, res: Response) => {
        const userId = req.userId
        try {
            const user = await User.findById(userId).select('-password')
            if (!user) {
                return res.status(400).json({ message: 'User not found' })
            }
            res.json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Something went wrong' })
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
