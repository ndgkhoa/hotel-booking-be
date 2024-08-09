import { Request, Response } from 'express'
import Comment from '../models/comment'
import Hotel from '../models/hotel'

const CommentsController = {
    createComment: async (req: Request, res: Response) => {
        const userId = req.userId
        const hotelId = req.params.hotelId
        const { content, rating } = req.body
        if (!content || !rating) {
            return res
                .status(400)
                .json({ message: 'Content and rating are required' })
        }
        try {
            const newComment = new Comment({
                userId,
                hotelId,
                content,
                rating,
            })
            await newComment.save()
            res.status(201).json({
                message: 'Comment created successfully',
                data: newComment,
            })
        } catch (error) {
            res.status(500).send({ message: 'Something went wrong' })
        }
    },

    getAllCommentsOfHotel: async (req: Request, res: Response) => {
        const hotelId = req.params.hotelId
        try {
            const hotel = await Hotel.findById({ _id: hotelId }).lean()
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' })
            }
            const comments = await Comment.find({ hotelId ,status:true}).lean()
            const sum = comments.reduce((acc, comment) => {
                if (comment.rating !== undefined) {
                    return acc + comment.rating
                }
                return acc
            }, 0)
            const averageRating = sum / comments.length
            res.status(201).json({
                message: 'Get data successfully',
                data: {
                    count: comments.length,
                    averageRating,
                    comments,
                },
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Something went wrong' })
        }
    },

    changeStatus: async (req: Request, res: Response) => {
        const commentId = req.params.commentId
        const comment = await Comment.findById({ _id: commentId })
        if (!comment)
            return res.status(500).json({ message: 'Comment not found' })
        comment.status = !comment.status
        comment.save()
        return res
            .status(200)
            .json({ message: 'Status updated successfully', data: comment })
    },
}

export default CommentsController
