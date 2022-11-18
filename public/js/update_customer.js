// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputStreet = document.getElementById("input-street-update");
    let inputCity = document.getElementById("input-city-update");
    let inputState = document.getElementById("input-state-update");
    let inputZipCode = document.getElementById("input-zip_code-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phone_number-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let streetValue = inputStreet.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipCodeValue = inputZipCode.value;
    let emailValue = inputEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;
    
    // currently the database table for Customers does not allow updating values to NULL

    if (isNaN(streetValue), isNaN(cityValue), isNaN(stateValue), isNaN(zipCodeValue), isNaN(emailValue), isNaN(phoneNumberValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        street: streetValue,
        city: cityValue,
        state: stateValue,
        zip_code: zipCodeValue,
        email: emailValue,
        phone_number: phoneNumberValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

            // Clear the input fields for another transaction
            inputFullName.value = '';
            inputStreet.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZipCode.value = '';
            inputEmail.value = '';
            inputPhoneNumber.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of columns value
            let tdStreet = updateRowIndex.getElementsByTagName("td")[3];
            let tdCity = updateRowIndex.getElementsByTagName("td")[4];
            let tdState = updateRowIndex.getElementsByTagName("td")[5];
            let tdZipCode = updateRowIndex.getElementsByTagName("td")[6];
            let tdEmail = updateRowIndex.getElementsByTagName("td")[7];
            let tdPhoneNumber = updateRowIndex.getElementsByTagName("td")[8];

            // Reassign columns to our value we updated to
            tdStreet.innerHTML = parsedData[0].street; 
            tdCity.innerHTML = parsedData[0].city; 
            tdState.innerHTML = parsedData[0].state; 
            tdZipCode.innerHTML = parsedData[0].zip_code; 
            tdEmail.innerHTML = parsedData[0].email; 
            tdPhoneNumber.innerHTML = parsedData[0].phone_number;
       }
    }
}