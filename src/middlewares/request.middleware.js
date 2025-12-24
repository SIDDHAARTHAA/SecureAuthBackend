import crypto from "crypto"

export const requestIdMiddleware = (req, res, next) => {
    req.requestId = crypto.randomUUID();
    req.trace = [];
    res.setHeader("X-Request-Id", req.requestId);
    next();
}