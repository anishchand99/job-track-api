BEGIN TRANSACTION;

CREATE TABLE application (
  app_id serial NOT NULL UNIQUE PRIMARY KEY,
  company_name varchar NOT NULL,
	date_applied timestamp NOT NULL,
	location varchar,
	job_description text,
	job_url text,
	specific_requirements text,
	comments text,
	accepted boolean NOT NULL,
	pending boolean NOT NULL,
	rejected boolean NOT NULL,
	list_id serial NOT NULL REFERENCES list(list_id)
);

COMMIT;
