import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const err = new Error("Email already registered");
        err.statusCode = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "Signup successful",
        accessToken,
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    //store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();


    //set the refreshToken in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "Login successful",
        accessToken,
    });
}


export const me = async (req, res) => {
    const userId = req.userId;

    const user = await User.findById(userId).select("name email");;

    if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email
    });
};


export const refresh = async (req, res) => {
    const { refreshToken } = req.cookies.refreshToken;

    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        const err = new Error("Invalid refresh token");
        err.statusCode = 401;
        throw err;
    }

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
        //revoked => access token has been used by someone else
        const err = new Error("Refresh token revoked");
        err.statusCode = 401;
        throw err;
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
        accessToken: newAccessToken
    });
};