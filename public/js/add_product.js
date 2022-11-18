// Get the objects we need to modify
let addProductForm = document.getElementById('add-product-form-ajax');

// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputProductName = document.getElementById("input-product_name");
    let inputQuantityInStock = document.getElementById("input-quantity_in_stock");
    let inputCategoryId = document.getElementById("input-category_id");
    let inputPrice = document.getElementById("input-price");
    let inputProductDescription = document.getElementById("input-product_description");

    // Get the values from the form fields
    let productNameValue = inputProductName.value;
    let quantityInStockValue = inputQuantityInStock.value;
    let categoryIDValue = inputCategoryId.value;
    let priceValue = inputPrice.value;
    let productDescriptionValue = inputProductDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        product_name: productNameValue,
        quantity_in_stock: quantityInStockValue,
        category_id: categoryIDValue,
        price: priceValue,
        product_description: productDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputProductName.value = '';
            inputQuantityInStock.value = '';
            inputCategoryId.value = '';
            inputPrice.value = '';
            inputProductDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Products
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("products-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let productIdCell = document.createElement("TD");
    let productNameCell = document.createElement("TD");
    let quantityInStockCell = document.createElement("TD");
    let categoryIdCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let productDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    productIdCell.innerText = newRow.product_id;
    productNameCell.innerText = newRow.product_name;
    quantityInStockCell.innerText = newRow.	quantity_in_stock;
    categoryIdCell.innerText = newRow.category_id;
    priceCell.innerText = newRow.price;
    productDescriptionCell.innerText = newRow.product_description;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCustomer(newRow.product_id);
    };

    // Add the cells to the row 
    row.appendChild(productIdCell);
    row.appendChild(productNameCell);
    row.appendChild(quantityInStockCell);
    row.appendChild(categoryIdCell);
    row.appendChild(priceCell);
    row.appendChild(productDescriptionCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.product_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.product_name;
    option.value = newRow.product_id;
    selectMenu.add(option);
}