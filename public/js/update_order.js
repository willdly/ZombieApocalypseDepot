// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("mySelect");
    let inputCustomerId = document.getElementById("input-customer_id-update");
    let inputOrderDate = document.getElementById("input-order_date-update");
    let inputTotal = document.getElementById("input-total-update");


    // Get the values from the form fields
  
    let orderIdValue = inputOrderId.value;
    let customerIdValue = inputCustomerId.value;
    let orderDateValue = inputOrderDate.value;
    let totalValue = inputTotal.value;

    
    // currently the database table for Orders does not allow updating values to NULL

    if (isNaN(orderIdValue), isNaN(orderDateValue), isNaN(totalValue)
        ) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderIdValue,
        customer_id: customerIdValue,
        order_date: orderDateValue,
        total: totalValue

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // console.log("frontend -> No error line 65");
            updateRow(xhttp.response, orderIdValue);

            // Clear the input fields for another transaction
            inputCustomerId.value = '';
            inputOrderDate.value = '';
            inputTotal.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("frontend -> There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    console.log("data: ", data);
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of columns value
            let tdCustomerId = updateRowIndex.getElementsByTagName("td")[1];
            let tdOrderDate = updateRowIndex.getElementsByTagName("td")[2];
            let tdTotal = updateRowIndex.getElementsByTagName("td")[3];


            // Reassign columns to our value we updated to
            tdCustomerId.innerHTML = parsedData[0].customer_id; 
            tdOrderDate.innerHTML = parsedData[0].order_date; 
            tdTotal.innerHTML = parsedData[0].total; 
       }
    }
}