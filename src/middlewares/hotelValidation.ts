import { body } from 'express-validator'

const hotelValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Hotel type is required'),
    body('pricePerNight')
        .notEmpty()
        .isNumeric()
        .withMessage('Price per night is required and must be a number'),
    body('facilities')
        .notEmpty()
        .isArray()
        .withMessage('Facilities are required'),
]

export default hotelValidationRules
