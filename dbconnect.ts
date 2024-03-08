import mysql from "mysql";

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "work5",
  password: "1234",
  database: "work5_api",
});