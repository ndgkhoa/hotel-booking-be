import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

export const generateToken = (
    accountId: string,
    userId: string,
    role: string,
): { accessToken: string; refreshToken: string } => {
    const accessToken = jwt.sign(
        { accountId, userId, role },
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: '1h',
        },
    )

    const refreshToken = jwt.sign(
        { accountId, userId, role, tokenId: uuidv4() },
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: '30d',
        },
    )

    return { accessToken, refreshToken }
}

export const setAuthTokenHeader = (
    res: any,
    tokens: { accessToken: string; refreshToken: string },
): void => {
    res.setHeader('Authorization', `Bearer ${tokens.accessToken}`)
}

export const newAccessToken = (
    refreshToken: string,
): { accessToken: string } | null => {
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET_KEY as string,
        ) as jwt.JwtPayload

        if (!decoded.accountId || !decoded.userId || !decoded.role) {
            return null
        }

        const accessToken = jwt.sign(
            {
                accountId: decoded.accountId,
                userId: decoded.userId,
                role: decoded.role,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1h' },
        )

        return { accessToken }
    } catch (error) {
        return null
    }
}
