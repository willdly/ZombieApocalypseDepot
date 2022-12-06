/*
CITATION
1. Scope: Functions/AJAX Requests
2. Date: 12/5/2022
3. Originality: Adapted
4. Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/
// Get the objects we need to modify
let addCategoryForm = document.getElementById('add-category-form-ajax');

// Modify the objects we need
addCategoryForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCategoryName = document.getElementById("input-category_name");
    let inputCategoryDescription = document.getElementById("input-category_description");

    // Get the values from the form fields
    let categoryNameValue = inputCategoryName.value;
    let categoryDescriptionValue = inputCategoryDescription.value;

    // Put our data we want to send in a javascript object
    let data = {
        category_name: categoryNameValue,
        category_description: categoryDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCategoryName.value = '';
            inputCategoryDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Customers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("categories-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let categoryIdCell = document.createElement("TD");
    let categoryNameCell = document.createElement("TD");
    let categoryDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    categoryIdCell.innerText = newRow.category_id;
    categoryNameCell.innerText = newRow.category_name;
    categoryDescriptionCell.innerText = newRow.category_description;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteCustomer(newRow.category_id);
    };

    // Add the cells to the row 
    row.appendChild(categoryIdCell);
    row.appendChild(categoryNameCell);
    row.appendChild(categoryDescriptionCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.category_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.category_name;
    option.value = newRow.category_id;
    selectMenu.add(option);
}