import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        sameSite: 'strict',  // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV !== 'development',
    });
}