import { NextFunction, Request, Response } from 'express'

const isSuppler = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== 'Role_Supplier') {
        return res.status(403).json({ message: 'Forbidden: Suppiler only' })
    }
    next()
}

export default isSuppler
