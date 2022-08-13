// Authentication of API requests
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Authentication failed'
        });
    }
}
// End of file auth.js
