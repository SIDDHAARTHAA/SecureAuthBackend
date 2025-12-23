import { z } from "zod"

export const signupSchema = z.object({
    // .trim() removes accidental whitespace
    name: z.string().trim().min(1, "Required").max(50),
    email: z.string().email("Invalid format").max(255),
    password: z.string().min(8).max(100)
});

export const loginSchema = z.object({
    email: z.string().email(), // Fixed the key name here
    password: z.string().min(1)
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1)
});