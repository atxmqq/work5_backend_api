import mysql from "mysql";

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "sql6.freemysqlhosting.net",
  user: "sql6689647",
  password: "JDFxRVbVIr",
  database: "sql6689647",
});