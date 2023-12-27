import mysql from "mysql2";
const pool = mysql
    .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})
    .promise();
async function getUsers() {
    const users = await pool.query("SELECT * FROM users");
    return users[0];
}
async function getUserById(id) {
    const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return user[0];
}
async function createUser(name, email) {
    const [user] = (await pool.query("INSERT INTO users (full_name, email) VALUES (?, ?)", [name, email]));
    const id = user.insertId;
    return getUserById(id);
}
export { getUsers, getUserById, createUser };
// "dev": "npm run tsc:w",
