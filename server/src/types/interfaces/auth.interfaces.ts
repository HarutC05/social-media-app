import { IUserModel } from "../../models/users.model";

export interface ILogin extends Pick<IUserModel, "password" | "username"> {}

export interface IRegister
    extends Pick<IUserModel, "password" | "username" | "email"> {}
