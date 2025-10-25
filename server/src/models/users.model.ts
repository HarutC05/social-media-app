import db from "../db/dbConnection";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface IUserModel extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    email: string;
    created_at: string;
    updated_at: string;
}

class UsersModel {
    async getById(id: number): Promise<IUserModel> {
        const [rows] = await db.query<IUserModel[]>(
            `SELECT * FROM users WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    async getByUsernameOrEmail(
        username?: string,
        email?: string
    ): Promise<IUserModel> {
        const [rows] = await db.query<IUserModel[]>(
            `SELECT * FROM users WHERE username = ? OR email = ?`,
            [username, email]
        );
        return rows[0];
    }

    async insert(
        username: string,
        email: string,
        password: string
    ): Promise<Partial<IUserModel>> {
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
            [username, password, email]
        );

        const {
            password: _password,
            created_at,
            updated_at,
            ...rest
        } = await this.getById(result.insertId);

        return rest;
    }
}

export default new UsersModel();
