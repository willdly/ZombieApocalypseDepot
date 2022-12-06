// Get the objects we need to modify
let updateProductsInOrdersForm = document.getElementById('update-products_in_orders-form-ajax');

// Modify the objects we need
updateProductsInOrdersForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderProductId = document.getElementById("select_order_product_id");
    let inputOrderId = document.getElementById("select_order_id");
    let inputProductId = document.getElementById("input-product_id-update");
    let inputQuantityPurchased = document.getElementById("input-quantity_purchased-update");
    let inputSubtotal = document.getElementById("input-subtotal-update");

    // Get the values from the form fields
  
    let orderProductIdValue = inputOrderProductId.value;
    let orderIdValue = inputOrderId.value;
    let productIdValue = inputProductId.value;
    let quantityPurchasedValue = inputQuantityPurchased.value;
    let subtotalValue = inputSubtotal.value;
    
    // currently the database table for Orders does not allow updating values to NULL

    // if (isNull(productIdValue), isNull(productNameValue), isNaN(priceValue), isNaN(quantityValue)
    //     ) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        order_product_id: orderProductIdValue,
        order_id: orderIdValue,
        product_id: productIdValue,
        quantity_purchased: quantityPurchasedValue,
        subtotal: subtotalValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product_in_order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // console.log("frontend -> No error line 65");
            updateRow(xhttp.response, orderProductIdValue);

            // Clear the input fields for another transaction
            inputOrderId.value = '';
            inputProductId.value = '';
            inputQuantityPurchased.value = '';
            inputSubtotal.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("frontend -> There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log("data: ", data);
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderproductID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("products-in-orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderproductID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of columns value
            let tdOrderId = updateRowIndex.getElementsByTagName("td")[1];
            let tdProductId = updateRowIndex.getElementsByTagName("td")[2];
            let tdQuantityPurchased = updateRowIndex.getElementsByTagName("td")[3];
            let tdSubtotal = updateRowIndex.getElementsByTagName("td")[4];


            // Reassign columns to our value we updated to
            tdOrderId.innerHTML = parsedData[0].order_id; 
            tdProductId.innerHTML = parsedData[0].product_id; 
            tdQuantityPurchased.innerHTML = parsedData[0].quantity_purchased; 
            tdSubtotal.innerHTML = parsedData[0].subtotal;
       }
    }
}