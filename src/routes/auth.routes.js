import express from "express"
import { login, me, refresh, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, refreshSchema, signupSchema } from "../validators/auth.schema.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), asyncHandler(signup));
router.post("/login", validate(loginSchema), asyncHandler(login));

router.post("/refresh", validate(refreshSchema), asyncHandler(refresh));

router.get("/me", authMiddleware, asyncHandler(me));

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        messsge: "from middleware"
        , userId: req.userId
    })
})

export default router;