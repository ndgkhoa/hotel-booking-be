import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            accountId:string
            userId: string
            role: string
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['token']
    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
        req.accountId = (decoded as JwtPayload).accountId
        req.userId = (decoded as JwtPayload).userId
        req.role = (decoded as JwtPayload).role
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}
export default verifyToken
