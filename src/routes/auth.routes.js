import express from "express"
import { deleteUser, login, logout, me, refresh, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../validators/auth.schema.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { authLimiter, generalLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", authLimiter, validate(signupSchema), asyncHandler(signup));
router.post("/login", authLimiter, validate(loginSchema), asyncHandler(login));
router.post("/logout", generalLimiter, asyncHandler(logout));

router.post("/refresh", authLimiter, asyncHandler(refresh));

router.delete("/admin/users/:id", generalLimiter, authMiddleware, asyncHandler(requireRole("ADMIN")), asyncHandler(deleteUser));

router.get("/me", generalLimiter, authMiddleware, asyncHandler(me));

router.get("/protected", generalLimiter, authMiddleware, (req, res) => {
    res.json({
        messsge: "from middleware"
        , userId: req.userId
    })
})

export default router;