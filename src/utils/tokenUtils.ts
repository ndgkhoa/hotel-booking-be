import jwt from 'jsonwebtoken'

export const generateToken = (userId: string): string => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '1d',
    })
    return token
}

export const setAuthTokenCookie = (res: any, token: string): void => {
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,
    })
}
