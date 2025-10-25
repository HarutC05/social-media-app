import { Response } from "express";
import { CustomError } from "./CustomError";

export function errorResponseGenerator(
    error: unknown,
    res: Response,
    origin = "Global"
) {
    if (error instanceof CustomError) {
        res.status(error.statusCode)
            .json({
                message: String(error.message),
            })
            .end();
        return;
    }
    console.error(origin, error);
    res.status(500)
        .json({
            message: "Something went wrong",
        })
        .end();
}
