import { Request, Response } from 'express'
import Category from '../models/category'
import _ from 'lodash'

const CategoriesController = {
    createCategory: async (req: Request, res: Response) => {
        try {
            const existingCategory = await Category.findOne({
                name: req.body.name,
            })
            if (existingCategory) {
                return res
                    .status(400)
                    .json({ message: 'Category already exists' })
            }
        } catch (error) {
            res.status(500).send({ message: 'Something went wrong' })
        }
        const newCategory = new Category({
            name: req.body.name,
        })
        await newCategory.save()
        res.status(201).json({ message: 'Category created successfully' })
    },

    getAllCategories: async (req: Request, res: Response) => {
        try {
            const categories = await Category.find().lean()
            const categoryData = categories.map((category) =>
                _.omit(category, ['__v']),
            )
            res.status(200).send({
                message: 'Get all categories successfully',
                data: categoryData,
            })
        } catch (error) {
            res.status(500).send({ message: 'Something went wrong' })
        }
    },
}

export default CategoriesController
