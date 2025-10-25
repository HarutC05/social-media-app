import { Response, Request, NextFunction, RequestHandler } from "express";

import { ILogin, IRegister } from "../types/interfaces/auth.interfaces";
import { registerUser, loginUser } from "../services/userService";
import { errorResponseGenerator } from "../utils/errorResponseGenerator";

export const register: RequestHandler = async (
    req: Request<{}, {}, IRegister>,
    res: Response
) => {
    try {
        const { username, email, password } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        await registerUser(req.body);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        errorResponseGenerator(error, res, "register");
    }
};

export const login: RequestHandler = async (
    req: Request<{}, {}, ILogin>,
    res: Response
) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        const token = await loginUser(req.body);

        if (!token) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: true,
                // secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: "Logged in successfully" });
    } catch (error) {
        errorResponseGenerator(error, res, "login");
    }
};
