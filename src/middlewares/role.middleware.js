import User from "../models/user.model.js"

export const requireRole = (role) => {
    return async (req, res, next) => {
        const user = await User.findById(req.userId);

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 401;
            throw err;
        }

        if(user.role != role) {
            const err = new Error("Forbidden");
            err.statusCode = 403;
            throw err;
        }

        next();
    };
};