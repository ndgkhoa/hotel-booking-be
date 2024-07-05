import jwt from 'jsonwebtoken'

export const generateToken = (
    accountId: string,
    userId: string,
    role: string,
): string => {
    const token = jwt.sign(
        { accountId, userId, role },
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: '1h',
        },
    )
    return token
}

export const setAuthTokenHeader = (res: any, token: string): void => {
    res.set('Authorization', `Bearer ${token}`)
}
