-- deploy database tables
\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/auth.sql'
\i '/docker-entrypoint-initdb.d/tables/list.sql'
\i '/docker-entrypoint-initdb.d/tables/application.sql'
