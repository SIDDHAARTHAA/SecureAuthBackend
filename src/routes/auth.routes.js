import express from "express"
import { deleteUser, login, logout, me, refresh, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../validators/auth.schema.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), asyncHandler(signup));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));

router.post("/refresh", authMiddleware, asyncHandler(refresh));

router.delete("/admin/users/:id", authMiddleware, asyncHandler(requireRole("ADMIN")), asyncHandler(deleteUser));

router.get("/me", authMiddleware, asyncHandler(me));

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        messsge: "from middleware"
        , userId: req.userId
    })
})

export default router;