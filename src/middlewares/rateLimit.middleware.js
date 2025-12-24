import rateLimit from "express-rate-limit";
import { log } from "../utils/logger.js";

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

export const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res) => {
        log({
            level: "warn",
            message: "Rate limit hit",
            req,
            meta: { ip: req.ip }
        });

        res.status(429).json({ message: "Too many attempts" })
    }
});