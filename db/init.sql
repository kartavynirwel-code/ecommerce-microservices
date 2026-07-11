-- Run this once against your MySQL server to provision the databases
-- used by each microservice. Replace the placeholder password below with
-- a strong secret of your own choosing when you run this manually - do not
-- commit the real password anywhere.
--
-- Usage:
--   mysql -u root -p < db/init.sql

CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS product_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS cart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dedicated application user with least-privilege access, scoped to only
-- the four databases above. Change 'CHANGE_ME_STRONG_PASSWORD' before running.
CREATE USER IF NOT EXISTS 'ecommerce_app'@'%' IDENTIFIED BY 'root_password';

GRANT ALL PRIVILEGES ON auth_db.*    TO 'ecommerce_app'@'%';
GRANT ALL PRIVILEGES ON product_db.* TO 'ecommerce_app'@'%';
GRANT ALL PRIVILEGES ON order_db.*   TO 'ecommerce_app'@'%';
GRANT ALL PRIVILEGES ON cart_db.*    TO 'ecommerce_app'@'%';

FLUSH PRIVILEGES;
