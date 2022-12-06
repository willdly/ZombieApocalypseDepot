// Get the objects we need to modify
let addOrderForm = document.getElementById('add-product-in-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("input-order_id");
    let inputProductId = document.getElementById("input-product_id");
    let inputQuantityPurchased = document.getElementById("input-quantity_purchased");
    let inputSubtotal = document.getElementById("input-subtotal");

    // Get the values from the form fields
    let orderIdValue = inputOrderId.value;
    let productIdValue = inputProductId.value;
    let quantityPurchasedValue = inputQuantityPurchased.value;
    let subtotalValue = inputSubtotal.value;

    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderIdValue,
        product_id: productIdValue,
        quantity_purchased: quantityPurchasedValue,
        subtotal: subtotalValue
    }

    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-product-in-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderId.value = '';
            inputProductId.value = '';
            inputQuantityPurchased.value = '';
            inputSubtotal.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Products in Orders
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("products-in-orders-table");

    // Get the location where we should insert the new row (end of table)
    // let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let orderProductIdCell = document.createElement("TD");
    let orderIdCell = document.createElement("TD");
    let productIdCell = document.createElement("TD");
    let quantityPurchasedCell = document.createElement("TD");
    let subtotalCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderProductIdCell.innerText = newRow.order_product_id;
    orderIdCell.innerText = newRow.order_id;
    productIdCell.innerText = newRow.product_id;
    quantityPurchasedCell.innerText = newRow.quantity_purchased;
    subtotalCell.innerText = newRow.subtotal;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOrder(newRow.order_id);
    };

    // Add the cells to the row 
    row.appendChild(orderProductIdCell);
    row.appendChild(orderIdCell);
    row.appendChild(productIdCell);
    row.appendChild(quantityPurchasedCell);
    row.appendChild(subtotalCell);

    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.order_product_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option 
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    // option.text = newRow.first_name + ' ' +  newRow.last_name;
    option.value = newRow.order_product_id;
    selectMenu.add(option);
}