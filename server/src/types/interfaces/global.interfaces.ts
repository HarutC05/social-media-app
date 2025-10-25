import { IUserModel } from "../../models/users.model";

declare global {
    namespace Express {
        export interface Request {
            user: IUserModel;
        }
    }
}
