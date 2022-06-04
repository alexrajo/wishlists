BEGIN;

SET client_encoding = "LATIN1";

CREATE TABLE users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(254) UNIQUE,
    token VARCHAR(256),
    PRIMARY KEY(user_id)
);

CREATE TABLE wishlists (
    wishlist_id BIGINT GENERATED ALWAYS AS IDENTITY,
    owner_id INTEGER NOT NULL,
    title VARCHAR(25) NOT NULL,
    description VARCHAR(128),
    content JSONB NOT NULL,
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

CREATE TABLE roles (
    name VARCHAR(16) UNIQUE NOT NULL,
    PRIMARY KEY(name)
);

CREATE TABLE user_roles (
    user_roles_id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    rolename VARCHAR(16) NOT NULL,
    expiration_date DATE,

    PRIMARY KEY(user_roles_id),

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id),
    
    CONSTRAINT fk_role
        FOREIGN KEY(rolename)
            REFERENCES roles(name)
);

INSERT INTO users (username, password, first_name, last_name, date_of_birth, email) VALUES ('System', '$2b$10$YrRtuGMQGh4.1VydgF2t9OKRZlUDlMIBDdMd8kTtRhZkyjiI46hpq', 'System', 'Systemson', '2002-09-09', 'system@wishlists.com');
INSERT INTO roles (name) VALUES ('user');
INSERT INTO roles (name) VALUES ('admin');
INSERT INTO user_roles (user_id, rolename) VALUES (1, 'user');
INSERT INTO user_roles (user_id, rolename) VALUES (1, 'admin');

COMMIT;