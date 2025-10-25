import { IUserModel } from "../../models/users.model";

export interface IUserMe
    extends Omit<IUserModel, "password" | "created_at" | "updated_at"> {}
