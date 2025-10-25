import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";
import { StringValue } from "ms";

const jwtSecret = process.env.JWT_SECRET_KEY;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN as StringValue;

export async function generateJwt(payload: JwtPayload): Promise<string> {
    try {
        if (!jwtSecret) {
            throw new CustomError("Failed to get JWT_SECRET_KEY");
        }
        if (!jwtExpiresIn) {
            throw new CustomError("Failed to get JWT_EXPIRES_IN");
        }

        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: jwtExpiresIn,
        });

        if (!token) {
            throw new CustomError("Invalid credentials");
        }

        return token;
    } catch (error) {
        console.error(error);
        throw new CustomError("Couldn't create jwt");
    }
}

export async function verifyJwt(token: string) {
    try {
        if (!jwtSecret) {
            return "Failed to get JWT_SECRET_KEY";
        }
        if (!jwtExpiresIn) {
            return "Failed to get JWT_EXPIRES_IN";
        }

        const isAuthenticated = jwt.verify(token, jwtSecret);

        if (!isAuthenticated) {
            return "Could not authenticate token";
        }

        return isAuthenticated;
    } catch (error) {
        throw new CustomError("Something went wrong when authenticating jwt");
    }
}
