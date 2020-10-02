CREATE TABLE auth (
  auth_id serial NOT NULL UNIQUE PRIMARY KEY,
  email varchar(100) UNIQUE NOT NULL,
  hash varchar(100) NOT NULL,
	id serial NOT NULL REFERENCES users(id)
);
