import jwt from "jsonwebtoken";

//checks if the users is loged in
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        throw err;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
