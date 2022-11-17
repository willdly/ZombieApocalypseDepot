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
    res.render('Orders');                    

});

app.get('/products', function(req, res)
{
    res.render('Products');                    

});

app.get('/categories', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.last_name === undefined)
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
    res.render('Products_in_Orders');                    

});

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
    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});