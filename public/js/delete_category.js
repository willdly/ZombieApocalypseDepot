/*
CITATION
1. Scope: Functions/AJAX Requests
2. Date: 12/5/2022
3. Originality: Adapted
4. Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/
function deleteCategory(categoryID) {
    // Put our data we want to send in a javascript object
    let data = {
        category_id: categoryID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(categoryID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

  
  function deleteRow(categoryID){
      let table = document.getElementById("categories-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
         if (table.rows[i].getAttribute("data-value") == categoryID) {
              table.deleteRow(i);
              break;
         }
      }
  }