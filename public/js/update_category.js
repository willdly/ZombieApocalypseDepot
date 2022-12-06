/*
CITATION
1. Scope: Functions/AJAX Requests
2. Date: 12/5/2022
3. Originality: Adapted
4. Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/
// Get the objects we need to modify
let updateCategoryForm = document.getElementById('update-category-form-ajax');

// Modify the objects we need
updateCategoryForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCategoryName = document.getElementById("mySelect");
    let inputCategoryDescription = document.getElementById("input-category_description-update");

    // Get the values from the form fields
    let categoryNameValue = inputCategoryName.value;
    let categoryDescriptionValue = inputCategoryDescription.value;
    
    // currently the database table for Customers does not allow updating values to NULL

    // Put our data we want to send in a javascript object
    let data = {
        category_name: categoryNameValue,
        category_description: categoryDescriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, categoryNameValue);

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


function updateRow(data, categoryID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("categories-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == categoryID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of columns value
            let tdCategoryDescription = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign columns to our value we updated to
            tdCategoryDescription.innerHTML = parsedData[0].category_description; 
       }
    }
}