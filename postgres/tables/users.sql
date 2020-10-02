BEGIN TRANSACTION;

CREATE TABLE users (
    id serial NOT NULL UNIQUE PRIMARY KEY,
    name varchar(100),
    email varchar(100) UNIQUE NOT NULL,
    joined timestamp UNIQUE NOT NULL
);

COMMIT;
