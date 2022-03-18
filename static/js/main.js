// Get the inputs elements
///////////////////////////
// Variables declaration and/or initialization
let inputs = ["title", "price", "taxes", "ads", "discount",
			  "total", "count", "category", "submit"];

// provide access to all the data of a product
// during the creation process
let product = {'length': 0}  

// declate and initialize vars to access the <inputs> elements
// Also, declare and initialize all the data (or properties)
// of "product" 
for (let i = 0; i < inputs.length; i++) {
	eval(`let ${inputs[i]} = document.getElementById("${inputs[i]}")`);

	// "submit" is not a product's property, and total can be
	// calculated easily so there're no need to storing it with
	// the "product" data. 
	if (inputs[i] != "submit" || inputs[i] != "submit")
		eval(`product.${inputs[i]} = ${inputs[i]}; product.length += 1;`)
}

// Specific vars
let mod = "create";  // a switch that help controling creating/updating a product 
let tmp;  // A shared cache that can be accessed by all the processes



// Product data
////////////////
submit.onclick = function (){
	// Create product // Create - Multiple products

	// Data validation - Limit set of data includes: name, price, and category
	if (! product.title.value || ! product.category.value || ! product.price.value)
		return
	else if (product.count.value > 100)
		return

	// a container for
	let proData = {};  // storing the product data in the storage
	for (let i = 0; i < product.length; i++){
		let obj = product[inputs[i]]

		if (product[inputs[i]] == "total")
			continue

		if (obj.type == "number"){
			// transform value only if numeric
			proData[inputs[i]] = (+obj.value)
		}
		else{
			let txt = obj.value? obj.value.toLowerCase(): ''
			proData[inputs[i]] = txt
		}
	}

	// Create a new list in the local storage called "products_data"
	// if it is not created yet --- and/or get access to it.
	if (! localStorage.getItem("products_data"))
		localStorage.setItem("products_data", JSON.stringify([]))
	let data = JSON.parse(localStorage.getItem("products_data"))

	// Update Mode
	if (mod == "update"){
		data[tmp] = proData;  // Update the product

		// switch "create" mode
		submit.innerHTML = "Create";
		mod = "create"
	}
	else{  // create mode

		// count specify the number of products in case of "multiple creation"
		let nb_of_products = product.count.value? product.count.value:1
		for (let i=0; i < nb_of_products; i++)
			data.push(proData)
	}

	// Save to local storage
	localStorage.setItem("products_data", JSON.stringify(data))

	// Start and complete any necessary process 
	// Note: The order of the functions is important
	showData()
	clearData()
}


function updateItem(id){
	// Update an existed item
	// "id" is a numeric value, this is not a fixed value
	// as it is an incremental value which will be updated
	// dynamically depending on the number of the products
	// However, the user has a clear access and visibility of it 

	// Access the storage & fetch the correspond item 
	let data = JSON.parse(localStorage.getItem("products_data"))

	if (! typeof id === "number" || id >= data.length)
		return  // an invalid id

	// fetch the correspond item
	let item = data[id];
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i] == "count" || inputs[i] == "total")
			continue

		// Update the <inputs> with the data of the correspond item
		eval(`${inputs[i]}.value = "${item[inputs[i]]}"`)
	}

	// For providing a good user experience
	getTotal()  // calculate the total
	scroll({top:0, behavior:"smooth"})  // scroll up to the main section

	// General settings and shared data
	tmp = id; // store the id in tmp to be accessed by other processes
	count.style.display = "none";  // hide "multiple creation" option
	submit.innerHTML = "Update";  // change the submit button value
	mod = "update";  // change to the updating mode
}


function getTotal(){
	// Calculate the totla only when the price is available 
	if (price.value){
		let result = +price.value + +taxes.value + +ads.value;
		result -= +discount.value;
		total.innerHTML = result;
		total.style.background = "#040"  // green
	}
	else{  // Total is not calculated
		total.innerHTML = ''
		total.style.background = "#a00d02"  // green
	}
}


function clearData(){
	// Clear all the data from the <inputs> elements
	// this is important after each successeful
	// creation or updating process to provide
	// a good user experience.
	for (d in product){
		if (d == "length")
			continue

		if (d == "total")
			product[d].innerHTML = '';
		else
			product[d].value = '';
	}

	// Clear the total and
	getTotal() // switch color to red
}


// Delete Item
function deleteItem(id){
	// Delete an item depending on its id
	let data = JSON.parse(localStorage.getItem("products_data"))
	data.splice(id, 1);

	// Update the storage
	localStorage.setItem("products_data", JSON.stringify(data));
	showData()  // Update the table
}


function deleteAllItems(){
	localStorage.setItem("products_data", JSON.stringify([]));
	showData()  // Update the table
}


function showData(){
	// Display all the stored data

	// access the products table and the get stored data
	let table = document.getElementById("table-body");
	table.innerHTML = ''
	let data = JSON.parse(localStorage.getItem("products_data"))

	// If there're no stored data, then hide the 
	// "Delete All Button" and end the process
	let deleteAll = document.getElementById("deleteAll");
	if (data.length == 0){
		deleteAll.style.visibility = "hidden";
		return
	}
	else{
		deleteAll.style.visibility = "visible";
		deleteAll.innerHTML = `Delete All (${data.length})`
	}


	for (var i = 0; i < data.length; i++) {
		let pro = data[i];  // a new product

		// Create a new <tr>
		let row = document.createElement("tr");

		// Give the product an ID
		let id = document.createElement("td");
		id.innerHTML = i + 1
		row.appendChild(id)


		// Create all the necessary fields
		for (let i = 0; i < product.length; i++) {
				if (inputs[i] == "count" || inputs[i] == "length")
					continue

				let field = document.createElement("td");
				field.innerHTML = pro[inputs[i]];
				row.appendChild(field);
			}

			// Create "update" and "delete" buttons for each product
			let buttons = ["update", "delete"]
			for (let i=0; i < buttons.length; i++){
				let field = document.createElement("td");
				let btn = document.createElement("button"); 
				btn.innerHTML = buttons[i]
				if (buttons[i] == "delete"){
					btn.id = "delete"
					btn.onclick = function (){deleteItem(+id.innerHTML - 1)};
				}
				else{
					btn.id = "update"
					btn.onclick = function (){updateItem(+id.innerHTML - 1)};
				}

				field.appendChild(btn)
				row.appendChild(field)
			}
			table.appendChild(row)
	}
}


function searchItem(btn) {
	let search_panel = document.getElementById("search");
	search_panel.placeholder = btn.innerHTML;
	search_panel.focus();
	search()
}


function search(){
	// Searching for specific item(s)

	// Fetch data from storage
	let data = JSON.parse(localStorage.getItem("products_data"))

	if (data.length == 0)
		return  // In case no items exists

	// Get the searching value
	let search_panel = document.getElementById("search");
	tmp = search.value

	let result = [];  // store the searching result
	// specify the searching key
	let key = (search_panel.placeholder == "Search by title")? "title": "category";
	let record;
	for (var i = 0; i < data.length; i++) {
		record = data[i];

		// If pattern match, add the record
		if (record[key].includes(search_panel.value.toLowerCase()))
			result.push(data[i]);
	}

	// Update the products table (only show the result)
	let table = document.getElementById("table-body");
	table.innerHTML = ''

	// Delete All Button
	let deleteAll = document.getElementById("deleteAll");
	deleteAll.style.visibility = "hidden";

	for (var i = 0; i < result.length; i++) {
		let pro = result[i];

		let row = document.createElement("tr");
		let id = document.createElement("td");
		id.innerHTML = i + 1
		row.appendChild(id)
		for (let i = 0; i < product.length; i++) {
				if (inputs[i] == "count" || inputs[i] == "length")
					continue

				let field = document.createElement("td");
				field.innerHTML = pro[inputs[i]];
				row.appendChild(field);
			}

			let buttons = ["update", "delete"]
			for (let i=0; i < buttons.length; i++){
				let field = document.createElement("td");
				let btn = document.createElement("button"); 
				btn.innerHTML = buttons[i]
				if (buttons[i] == "delete"){
					btn.id = "delete"
					btn.onclick = function (){deleteItem(+id.innerHTML - 1)};
				}
				else{
					btn.id = "update"
					btn.onclick = function (){updateItem(+id.innerHTML - 1)};
				}

				field.appendChild(btn)
				row.appendChild(field)
			}
			table.appendChild(row)
	}
}


function changeMode(){
	// Change from light mode to black mode and vice verca

	let body = document.getElementsByTagName("body")[0]
	let mode = document.getElementById("mode")
	let head = document.getElementsByClassName("head")[0]
	if (mode.innerHTML == "Dark"){
		mode.innerHTML = "Light";
		mode.style.background = "lightcyan";
		mode.style.color = "darkgoldenrod";
		body.classList.remove('light')
		head.style.color = "white";
	}
	else{
		mode.innerHTML = "Dark";
		mode.style.background = "black";
		mode.style.color = "darkmagenta";
		body.classList.add('light')
		head.style.color = "black";
	}
}


window.onload = function(){
	getTotal()  // Calculate the totalt if there's value in <inputs>
	showData() // Show the stored items  
	deleteAllItems()  // Does not really delete all the items
	// On load (or reload), it will hide the "delete all btn"
	// if their no data in storage
}