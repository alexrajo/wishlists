const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const { Pool, Client } = require("pg");


const credentials = {
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "wishlist-db",
    dialect: "postgres"
};

const pool = new Pool(credentials);

const getAllUsers = async () =>  {
    const result = await pool.query("SELECT * FROM users LIMIT 50");
    return result;
}

const getUser = async (id) => {
    const result = await pool.query("SELECT username, first_name, last_name, date_of_birth FROM users WHERE id=" + id);
    return result.rows[0];
}

const getUserWishlists = async(userId) => {
    const result = await pool.query("SELECT * FROM wishlists WHERE owner_id=" + userId);
    return result.rows;
}

const handleCatch = (err, res) => {
    res.statusMessage = err;
    res.status(500).end();
}

app.get("/users", (req, res) => {
    getAllUsers().then(users => {
        res.json(users);
    }).catch(err => {
        handleCatch(err, res);
    });
});

app.get("/profile/:id", (req, res) => {
    getUser(req.params.id).then(user => {
        if (user == null) {
            throw Error("User data not found.");
        }
        res.send(user);
    }).catch(err => {
        handleCatch(err, res);
    });
});

app.get("/user_wishlists/:id", (req, res) => {
    getUserWishlists(req.params.id).then(lists => {
        res.json(lists);
    }).catch(err => {
        handleCatch(err, res);
    });
});

const server = app.listen(PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Started server at port: ", port);
});