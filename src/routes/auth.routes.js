import express from "express"
import { login, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        messsge: "from middleware"
        , userId: req.userId
    })
})

export default router;