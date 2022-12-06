/*
CITATION
1. Scope: Functions/AJAX Requests
2. Date: 12/5/2022
3. Originality: Adapted
4. Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/
// Get the objects we need to modify
let updateProductForm = document.getElementById('update-product-form-ajax');

// Modify the objects we need
updateProductForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductName = document.getElementById("mySelect");
    let inputQuantityInStock = document.getElementById("input-quantity_in_stock-update");
    let inputCategoryId = document.getElementById("input-category_id-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputProductDescription = document.getElementById("input-product_description-update");

    // Get the values from the form fields
  
    let productNameValue = inputProductName.value;
    let quantityInStockValue = inputQuantityInStock.value;
    let categoryIdValue = inputCategoryId.value;
    let priceValue = inputPrice.value;
    let productDescriptionValue = inputProductDescription.value;
    
    // currently the database table for Orders does not allow updating values to NULL

    // if (isNull(productIdValue), isNull(productNameValue), isNaN(priceValue), isNaN(quantityValue)
    //     ) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        product_name: productNameValue,
        quantity_in_stock: quantityInStockValue,
        category_id: categoryIdValue,
        price: priceValue,
        product_description: productDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // console.log("frontend -> No error line 65");
            updateRow(xhttp.response, productNameValue);

            // Clear the input fields for another transaction
            inputProductName.value = '';
            inputQuantityInStock.value = '';
            inputCategoryId.value = '';
            inputPrice.value = '';
            inputProductDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("frontend -> There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log("data: ", data);
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, productID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("products-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == productID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of columns value
            let tdProductName = updateRowIndex.getElementsByTagName("td")[1];
            let tdQuantityInStock = updateRowIndex.getElementsByTagName("td")[2];
            let tdCategoryId = updateRowIndex.getElementsByTagName("td")[3];
            let tdPrice = updateRowIndex.getElementsByTagName("td")[4];
            let tdProductDescription = updateRowIndex.getElementsByTagName("td")[5];


            // Reassign columns to our value we updated to
            tdProductName.innerHTML = parsedData[0].product_name; 
            tdQuantityInStock.innerHTML = parsedData[0].quantity_in_stock; 
            tdCategoryId.innerHTML = parsedData[0].category_id; 
            tdPrice.innerHTML = parsedData[0].price;
            tdProductDescription.innerHTML = parsedData[0].product_description;
       }
    }
}