BEGIN TRANSACTION;

CREATE TABLE list (
    list_id serial NOT NULL UNIQUE PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE,
    date_created timestamp NOT NULL,
	  id serial NOT NULL REFERENCES users(id)
);

COMMIT;
