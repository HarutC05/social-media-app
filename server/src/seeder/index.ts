import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

async function createConnectionDB(): Promise<Connection> {
    return await mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
    });
}

async function seedDatabase(db: Connection): Promise<void> {
    console.log("Started creating DB");

    await db.query("CREATE DATABASE IF NOT EXISTS social_media_app");
    console.log("DB successfully created/already exists");
}

async function seedUsersTable(db: Connection): Promise<void> {
    console.log("Starting seed Users table");

    await db.query(`
        CREATE TABLE IF NOT EXISTS social_media_app.users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);

    const [usersRows] = await db.query(
        `SELECT COUNT(*) as count FROM social_media_app.users;`
    );

    const firstRow = usersRows as { count: number }[];
    if (firstRow[0].count > 0) {
        return;
    }

    const hashedPassword = await bcrypt.hash("qwer1234", 10);

    await db.query(
        `INSERT INTO social_media_app.users (username, email, password) VALUES (?,?,?)`,
        ["user", "user@email.com", hashedPassword]
    );

    console.log("Users table seed complete.");
}

async function seedPostsTable(db: Connection): Promise<void> {
    console.log("Starting seed Posts table");

    await db.query(`
        CREATE TABLE IF NOT EXISTS social_media_app.posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            author_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);

    const [postsRows] = await db.query(
        `SELECT COUNT(*) as count FROM social_media_app.posts;`
    );

    const firstRow = postsRows as { count: number }[];
    if (firstRow[0].count > 0) {
        return;
    }

    await db.query(`
        INSERT INTO social_media_app.posts (title, content, author_id)
        VALUES ('My First Post', 'This is the content of my first post.', 1);`);

    console.log("Posts table seed complete.");
}

export async function seeder(): Promise<void> {
    try {
        console.log("Starting seed DB");
        const connection = await createConnectionDB();
        console.log("Connected to mysql server");

        await seedDatabase(connection);
        await seedUsersTable(connection);
        await seedPostsTable(connection);

        console.log("DB seed success");
    } catch (error) {
        console.log("Failed seeding DB: ", error);
    }
}
