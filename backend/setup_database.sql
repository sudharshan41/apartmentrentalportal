-- Run this SQL script in PostgreSQL to set up the database
-- You can use pgAdmin or psql command line

-- Create the user
CREATE USER admin WITH PASSWORD 'admin123';

-- Create the database
CREATE DATABASE rental_portal OWNER admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rental_portal TO admin;

-- Connect to the database and grant schema privileges
\c rental_portal
GRANT ALL ON SCHEMA public TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;
