import bcrypt from "bcrypt";

import UsersModel, { IUserModel } from "../models/users.model";
import { ILogin, IRegister } from "../types/interfaces/auth.interfaces";
import { CustomError } from "../utils/CustomError";
import { generateJwt } from "../middleware/user.auth";

export async function getUserById(id: number): Promise<IUserModel> {
    return await UsersModel.getById(id);
}

export async function registerUser(registerData: IRegister): Promise<void> {
    const userData = await UsersModel.getByUsernameOrEmail(
        registerData.username,
        registerData.email
    );

    if (userData?.id) {
        throw new CustomError("Username or Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    await UsersModel.insert(
        registerData.username,
        registerData.email,
        hashedPassword
    );
}

export async function loginUser(loginData: ILogin): Promise<string> {
    const userData = await UsersModel.getByUsernameOrEmail(loginData.username);
    if (!userData) {
        throw new CustomError(
            `User with username: "${loginData.username}", does not exist`
        );
    }

    const isPasswordMatch = await bcrypt.compare(
        userData.password,
        loginData.password
    );
    if (!isPasswordMatch) {
        throw new CustomError("Incorrect password for that username");
    }

    return await generateJwt(userData);
}
