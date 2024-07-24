import { NextFunction, Request, Response } from 'express'

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== 'Role_Admin') {
        return res.status(403).json({ message: 'Forbidden: Admin only' })
    }
    next()
}

export default isAdmin
