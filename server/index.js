const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const { Pool, Client } = require("pg");


const credentials = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: process.env.DB_PORT || 5432,
    database: "wishlist-db",
    dialect: "postgres"
};

const getAllUsers = async () =>  {
    const pool = new Pool(credentials);
    const result = await pool.query("SELECT * FROM users");
    return result;
}

app.get("/users", (req, res) => {
    const users = getAllUsers().then(users => {
        res.json(users);
    }).catch(err => {
        res.statusMessage = err;
        res.status(500).end();
    });
});

const server = app.listen(PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Started server at port: ", port);
});