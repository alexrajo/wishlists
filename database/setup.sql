BEGIN;

SET client_encoding = "LATIN1";

CREATE TABLE users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(20) NOT NULL,
    password CHAR(60) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(254) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE wishlists (
    wishlist_id BIGINT GENERATED ALWAYS AS IDENTITY,
    owner_id INTEGER NOT NULL,
    title VARCHAR(25) NOT NULL,
    description VARCHAR(128),
    list VARCHAR(50) ARRAY NOT NULL,
    PRIMARY KEY(wishlist_id)
);

CREATE TABLE friendships (
    friendship_id BIGINT GENERATED ALWAYS AS IDENTITY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    confirmed BOOLEAN NOT NULL,
    PRIMARY KEY(friendship_id),
    CONSTRAINT fk_user1
        FOREIGN KEY(user1_id)
            REFERENCES users(user_id),
    
    CONSTRAINT fk_user2
        FOREIGN KEY(user2_id)
            REFERENCES users(user_id)
);

CREATE TABLE auth_tokens (
    token_id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    value CHAR(32),
    created TIMESTAMP,
    PRIMARY KEY(token_id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id)
);

COMMIT;