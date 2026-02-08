import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    // get the token from header
    let token = req.headers.authorization;

    console.log("1. Authorization Header received:", token);

    // check that the token is in the correct format
    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];

            console.log("2. Token after split:", token);
            console.log("DEBUG - Secret in Middleware:", process.env.JWT_SECRET);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("3. Decoded successfully:", decoded); 
            
            req.user = decoded;
            return next(); // שימוש ב-return כדי לוודא שהפונקציה נעצרת כאן

        } catch (error) {
            console.log("JWT Verification Failed:", error.message);
            return res.status(401).json({
                message: "Not Authorized, token failed"
            });
        }
    }

    // אם אין טוקן בכלל
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

// ייצוא מודרני
export default authMiddleware;