-- Group: 98
-- Team Members: Calvin Saelee, William Ly
-- Project: Zombie Apocalypse Depot
-- Project Step 2 Draft

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Customers;

-- Create Customers Table
CREATE TABLE Customers (
    customer_id int NOT NULL AUTO_INCREMENT UNIQUE,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    street varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    state varchar(2) NOT NULL,
    zip_code varchar(10) NOT NULL,
    email varchar(255) NOT NULL,
    phone_number varchar(15) NOT NULL,
    
    PRIMARY KEY (customer_id)
);

DROP TABLE IF EXISTS Orders;

-- Create Orders Table
CREATE TABLE Orders (
    order_id int NOT NULL AUTO_INCREMENT UNIQUE,
    customer_id int,
    order_date date NOT NULL,
    total decimal(10,2) NOT NULL,
    
    PRIMARY KEY (order_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS Products_in_Order;

-- Create Products_in_Order Table
CREATE TABLE Products_in_Orders (
    order_product_id int NOT NULL AUTO_INCREMENT UNIQUE,
    order_id int NOT NULL,
    product_id int NOT NULL,
    quantity_purchased int UNSIGNED NOT NULL,
    subtotal decimal(10,2) NOT NULL,
    
    PRIMARY KEY (order_product_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

DROP TABLE IF EXISTS Products;

-- Create Products Table
CREATE TABLE Products (
    product_id int NOT NULL AUTO_INCREMENT UNIQUE,
    product_name varchar(255) NOT NULL,
    quantity_in_stock int UNSIGNED NOT NULL,
    category_id int NOT NULL,
    price decimal(10,2) NOT NULL,
    product_description text NOT NULL,
    
    PRIMARY KEY (product_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON UPDATE CASCADE
);

DROP TABLE IF EXISTS Categories;

-- Create Categories Table
CREATE TABLE Categories (
    category_id int NOT NULL AUTO_INCREMENT UNIQUE,
    category_name varchar(255) NOT NULL,
    category_description text NOT NULL,
    
    PRIMARY KEY (category_id)
);

-- Inserting Values
INSERT INTO Customers (first_name, last_name, street, city, state, zip_code, email, phone_number)
VALUES
('Misty', 'Seay', '3999 Sigley Road', 'Burlingame', 'KS', '66413', 'MistyRSeay@gmail.com', '785-654-3357'),
('Linda', 'Guyer', '1532 Arbutus Drive', 'Hialeah', 'FL', '33012', 'LindaTGuyer@gmail.com', '305-834-8267'),
('Santos', 'Collazo', '211 Jarvis Street', 'Buffalo', 'NY', '14202', 'SantosBCollazo@gmail.com', '716-859-3362');

INSERT INTO Categories (category_name, category_description)
VALUES ('Food', 'Anything and everything that customers can eat or drink'),
('Safety', 'Anything and everything that customers can use to keep them safe'),
('Firearm', 'Anything and everything that customers can use to remove zombies(or threats)');

INSERT INTO Products (product_name, quantity_in_stock, category_id, price, product_description)
VALUES ('Flamethrower 3000', 40, (SELECT category_id FROM Categories WHERE category_name = 'Firearm'), 999.99, 'A zombie apocalypse can happen any time from now, you must prepare for the future. Protect you and your loved ones and burn these zombies to the ground!'),
('Zombie Brain Blaster', 20, (SELECT category_id FROM Categories WHERE category_name = 'Firearm'), 449.99, 'Want to ensure a zombie is dead for good? No worries! Blast its brain into pieces with this blaster.'),
('Emergency Flare Kit', 30, (SELECT category_id FROM Categories WHERE category_name = 'Safety'), 24.99, 'Protect you and your family during a zombie apocalypse. Flares prevent you from being eaten by a zombie and save lives. Flares are safe and easy to use.'),
('Spam Luncheon Meat', 50, (SELECT category_id FROM Categories WHERE category_name = 'Food'), 3.50, "It's America's #1 canned luncheon meat brand* - made with simple ingredients, has 7 g of protein per serving, and is fully cooked and shelf stable.");

INSERT INTO Products_in_Orders (order_id, product_id, quantity_purchased, subtotal)
VALUES (1, 1, 2, 1999.98),
    (1, 3, 2, 49.98),
    (2, 4, 2, 35.00),
    (3, 2, 2, 1349.97),
    (3, 4, 2, 17.50);

INSERT INTO Orders (customer_id, order_date, total)
VALUES ((SELECT customer_id FROM Customers WHERE first_name='Linda' and last_name='Guyer'), '2050-01-10', (SELECT SUM(subtotal) FROM Products_in_Orders WHERE order_id=1)),
    ((SELECT customer_id FROM Customers WHERE first_name='Misty' and last_name='Seay'), '2050-01-16', (SELECT SUM(subtotal) FROM Products_in_Orders WHERE order_id=2)),
    ((SELECT customer_id FROM Customers WHERE first_name='Santos' and last_name='Collazo'), '2050-02-02',(SELECT SUM(subtotal) FROM Products_in_Orders WHERE order_id=3));

SELECT * FROM Customers;
SELECT * FROM Orders;
SELECT * FROM Products_in_Orders;
SELECT * FROM Products;
SELECT * FROM Categories;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;