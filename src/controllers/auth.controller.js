import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err;
    }


    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const err = new Error("Email already registered");
        err.statusCode = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return res.status(201).json({
        message: "User created",
        token: token
    })


};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err;
    }


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

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return res.status(200).json({
        message: "Login successful",
        token
    });
}

//what does bcrypt.compare actually do
//after signup, does the user be loged in or should he log in once again?
//because, in signup route also we are sending token