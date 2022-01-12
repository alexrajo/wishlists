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

const pool = new Pool(credentials);

const getAllUsers = async () =>  {
    const result = await pool.query("SELECT * FROM users");
    return result;
}

const getUser = async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id=" + id);
    return result.rows[0];
}

app.get("/users", (req, res) => {
    getAllUsers().then(users => {
        res.json(users);
    }).catch(err => {
        res.statusMessage = err;
        res.status(500).end();
    });
});

app.get("/profile/:id", (req, res) => {
    getUser(req.params.id).then(user => {
        if (user == null) {
            throw Error("User data not found.");
        }
        res.send(user);
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