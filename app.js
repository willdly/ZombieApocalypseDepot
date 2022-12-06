// App.js

/*
    SETUP
*/

// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 5422;                 // Set a port number at the top so it's easy to change in the future
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)
{
    res.render('HomePage');                    

});

app.get('/customers', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.last_name === undefined)
    {
        query1 = "SELECT * FROM Customers;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Customers WHERE last_name LIKE "${req.query.last_name}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let people = rows;
        return res.render('Customers', {data: people});
    })
});                                // will process this file, before sending the finished HTML to the client.

app.get('/orders', function(req, res)
{
     // Declare Query 2
     let query2;

     // If there is no query string, we just perform a basic SELECT
     if (req.query.customer_id === undefined)
     {
         query2 = "SELECT * FROM Orders;";
     }
 
     // If there is a query string, we assume this is a search, and return desired results
     else
     {
         query2 = `SELECT * FROM Orders WHERE customer_id = "${req.query.customer_id}"`
     }
 
     // Run the 2nd query
     db.pool.query(query2, function(error, rows, fields){
         
         // Save the people
         let order = rows;
         return res.render('Orders', {data: order});
     })                    

});

app.get('/products', function(req, res)
{
         // Declare Query 3
         let query3;
         let query4 = "SELECT * FROM Categories;";

         // If there is no query string, we just perform a basic SELECT
         if (req.query.product_name === undefined)
         {
             query3 = "SELECT * FROM Products;";
         }
     
         // If there is a query string, we assume this is a search, and return desired results
         else
         {
             query3 = `SELECT * FROM Products WHERE product_name LIKE "${req.query.product_name}%"`
         }
     
         // Run the 2nd query
         db.pool.query(query3, function(error, rows, fields){
             
             // Save the people
             let product = rows;

             db.pool.query(query4, function(error, rows, fields){
                let categories = rows
                return res.render('Products', {data: product, categories: categories});
             })
         })                     
});

app.get('/categories', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.category_name === undefined)
    {
        query1 = "SELECT * FROM Categories;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Categories WHERE category_name LIKE "${req.query.category_name}%"`
    }

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let categories = rows;
        return res.render('Categories', {data: categories});
    })
});

app.get('/products_in_orders', function(req, res)
{
     // Declare Query 2
     let query1;

     // If there is no query string, we just perform a basic SELECT
     if (req.query.order_id === undefined)
     {
         query1 = "SELECT * FROM Products_in_Orders;";
     }
 
     // If there is a query string, we assume this is a search, and return desired results
     else
     {
         query1 = `SELECT * FROM Products_in_Orders WHERE order_id = "${req.query.order_id}"`
     }

    let query2 = "SELECT * FROM Orders;";
    let query3 = "SELECT * FROM Products;";

     // Run the 1st query
     db.pool.query(query1, function(error, rows, fields){
         
         // Save the people
         let product_in_order = rows;

         // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the orders
            let orders = rows;

            // Run the second query
            db.pool.query(query3, (error, rows, fields) => {
            
                // Save the products
                let products = rows;

            return res.render('Products_in_Orders', {data: product_in_order, orders: orders, products: products});
            })
        })
     })                    

});

// Customers
app.post('/add-customer-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (first_name, last_name, street, city, state, zip_code, email, phone_number) VALUES ('${data.first_name}', '${data.last_name}', '${data.street}', '${data.city}', '${data.state}', '${data.zip_code}', '${data.email}', '${data.phone_number}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Customers
            query2 = `SELECT Customers.customer_id, Customers.first_name, Customers.last_name, Customers.street, Customers.city, Customers.state, Customers.zip_code, Customers.email, Customers.phone_number FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.customer_id);
    let deleteOrders = `DELETE FROM Orders WHERE customer_id = ?`;
    let deleteCustomer= `DELETE FROM Customers WHERE customer_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteOrders, [customerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomer, [customerID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.put('/put-customer-ajax', function(req,res,next){
let data = req.body;

let street = data.street;
let customer = data.fullname;
let city = data.city;
let state = data.state;
let zip_code = data.zip_code;
let email = data.email;
let phone_number = data.phone_number;


let queryUpdateCustomer = `UPDATE Customers SET street = ?, city = ?, state = ?, zip_code = ?, email = ?, phone_number = ? WHERE customer_id = ?`;
let selectCustomer= `SELECT * FROM Customers WHERE customer_id = ?`

        // Run the 1st query
        db.pool.query(queryUpdateCustomer, [street, city, state, zip_code, email, phone_number, customer], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectCustomer, [customer], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// Orders
app.post('/add-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customer_id, order_date, total) VALUES ('${data.customer_id}', '${data.order_date}', '${data.total}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Orders
            query2 = `SELECT Orders.order_id, Orders.customer_id, Orders.order_date, Orders.total FROM Orders;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;
    let orderID = parseInt(data.order_id);
    let deleteOrders = `DELETE FROM Orders WHERE order_id = ?`;
    let deleteProductInOrder= `DELETE FROM Products_in_Orders WHERE order_id = ?`;
    // let setForeignToZero = `SET FOREIGN_KEY_CHECKS=0`;
    
    //         db.pool.query(setForeignToZero)
            // Run the 1st query
            db.pool.query(deleteProductInOrder, [orderID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                else
                {
                    // Run the second query
                    db.pool.query(deleteOrders, [orderID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
    })});

app.put('/put-order-ajax', function(req,res,next){
    let data = req.body;

    let order_id = data.order_id;
    let customer_id = data.customer_id;
    let order_date = data.order_date;
    let total = data.total;
    // console.log(order_id)

    let queryUpdateOrder = `UPDATE Orders SET customer_id = ?, order_date = ?, total = ? WHERE order_id = ?`;
    let selectOrder= `SELECT * FROM Orders WHERE order_id = ?`

            // Run the 1st query
            db.pool.query(queryUpdateOrder, [customer_id, order_date, total, order_id], function(error, rows, fields){
                if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }

                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectOrder, [order_id], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

// Categories
app.post('/add-category-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Categories (category_name, category_description) VALUES ('${data.category_name}', '${data.category_description}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Customers
            query2 = `SELECT Categories.category_id, Categories.category_name, Categories.category_description FROM Categories;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-category-ajax/', function(req,res,next){
    let data = req.body;
    let categoryID = parseInt(data.category_id);
    let deleteProduct = `DELETE FROM Products WHERE category_id = ?`;
    let deleteCategory= `DELETE FROM Categories WHERE category_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteProduct, [categoryID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCategory, [categoryID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  app.put('/put-category-ajax', function(req,res,next){
    let data = req.body;
    
    let category_description = data.category_description;
    let category_name = data.category_name;
    
    
    let queryUpdateCategory = `UPDATE Categories SET category_description = ? WHERE category_id = ?`;
    let selectCategory= `SELECT * FROM Categories WHERE category_id = ?`
    
            // Run the 1st query
            db.pool.query(queryUpdateCategory, [category_description, category_name], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectCategory, [category_name], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

// Products
app.post('/add-product-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Products (product_name, quantity_in_stock, category_id, price, product_description) VALUES ('${data.product_name}', '${data.quantity_in_stock}', '${data.category_id}', '${data.price}', '${data.product_description}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Customers
            query2 = `SELECT Products.product_id, Products.product_name, Products.quantity_in_stock, Products.category_id, Products.price, Products.product_description FROM Products;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-product-ajax/', function(req,res,next){
    let data = req.body;
    let productID = parseInt(data.product_id);
    let deleteProducts = `DELETE FROM Products WHERE product_id = ?`;
    let deleteProductInOrder= `DELETE FROM Products_in_Orders WHERE product_id = ?`;
    // let setForeignToZero = `SET FOREIGN_KEY_CHECKS=0`;
    
    //         db.pool.query(setForeignToZero)
            // Run the 1st query
            db.pool.query(deleteProductInOrder, [productID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                else
                {
                    // Run the second query
                    db.pool.query(deleteProducts, [productID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
    })});

app.put('/put-product-ajax', function(req,res,next){
    let data = req.body;

    let product_name = data.product_name;
    let quantity_in_stock = data.quantity_in_stock;
    let category_id = data.category_id;
    let price = data.price;
    let product_description = data.product_description;

    let queryUpdateProduct = `UPDATE Products SET quantity_in_stock = ?, category_id = ?, price = ?, product_description = ? WHERE product_id = ?`;
    let selectProduct= `SELECT * FROM Products WHERE product_id = ?`

            // Run the 1st query
            db.pool.query(queryUpdateProduct, [quantity_in_stock, category_id, price, product_description, product_name], function(error, rows, fields){
                if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }

                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectProduct, [product_name], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

// Products in Orders
app.post('/add-product-in-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Products_in_Orders (order_id, product_id, quantity_purchased, subtotal) VALUES ('${data.order_id}', '${data.product_id}', '${data.quantity_purchased}', '${data.subtotal}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Orders
            query2 = `SELECT Products_in_Orders.order_product_id, Products_in_Orders.order_id, Products_in_Orders.product_id, Products_in_Orders.quantity_purchased, Products_in_Orders.subtotal FROM Products_in_Orders;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-products-in-orders-ajax/', function(req,res,next){
    let data = req.body;
    let productOrderID = parseInt(data.order_product_id);
    let deleteProductsInOrders = `DELETE FROM Products_in_Orders WHERE order_product_id = ?`;
    let deleteProductInOrder= `DELETE FROM Products_in_Orders WHERE order_id = ?`;
    // let setForeignToZero = `SET FOREIGN_KEY_CHECKS=0`;
    
    //         db.pool.query(setForeignToZero)
            // Run the 1st query
            db.pool.query(deleteProductInOrder, [productOrderID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                else
                {
                    // Run the second query
                    db.pool.query(deleteProductsInOrders, [productOrderID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
    })});

app.put('/put-product_in_order-ajax', function(req,res,next){
    let data = req.body;

    let order_product_id = data.order_product_id;
    let order_id = data.order_id;
    let product_id = data.product_id;
    let quantity_purchased = data.quantity_purchased;
    let subtotal = data.subtotal;

    let queryUpdateProductInOrder = `UPDATE Products_in_Orders SET order_id = ?, product_id = ?, quantity_purchased = ?, subtotal = ? WHERE order_product_id = ?`;
    let selectProductInOrder= `SELECT * FROM Products_in_Orders WHERE order_product_id = ?`

            // Run the 1st query
            db.pool.query(queryUpdateProductInOrder, [order_id, product_id, quantity_purchased, subtotal, order_product_id], function(error, rows, fields){
                if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }

                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectProductInOrder, [order_product_id], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});