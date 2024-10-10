function showElement() {

    // get the selected
    const selected = document.querySelector('input[name="options"]:checked');

    // check if a radio button is selected
    if (selected) {

        var selectedID = selected.id;
        var products = document.getElementById('products');
        var stores = document.getElementById('stores');
        var orders = document.getElementById('orders');

        switch (selectedID) {

            case "Products":

                products.style.display = 'block';
                stores.style.display = 'none';
                orders.style.display = 'none';
            
            case "Stores":

                products.style.display = 'none';
                stores.style.display = 'block';
                orders.style.display = 'none';
            
            case "Orders":

                products.style.display = 'none';
                stores.style.display = 'none';
                orders.style.display = 'block';

        }


    } else {

        console.log('nothing is selected');
        
    }

}

function deleteItem(item, type) {

    item = JSON.parse(item);
    if (confirm("Are you sure you want to delete  " + item.cardName + "?")) {
        fetch(`/admin/${type}/${item.cardId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            if (data.status == 200) {

                window.alert("successfully deleted " + item.cardName);

            }
            else {

                window.alert("could not delete " + item.cardName + ": " + data.message);

            }
            
            // Optionally, refresh the page or remove the item from the DOM
            location.reload(); // Reloads the page to reflect changes
        })
        .catch(error => {
            window.alert("Error deleting item: " + error.message);
        });
    }

}

function showPopUp(data) {

    const popup = document.getElementById('popupSection');
    const type = data.type;
    const action = data.action;

    switch (type) {

        case "products":

            const endpoint = "/admin/popup/products?action=";

            if (action == 'Create') {

                fetch(`${endpoint}Create`)
                .then(response => response.text())
                .then(html => {
                    popup.innerHTML = html;
                })
                .catch(err => console.log('Error loading popup:', err));

            }
            else {

                const cardName = data.cardName;

                fetch(`${endpoint}Edit&cardName=${cardName}`)
                .then(response => response.text())
                .then(html => {
                    popup.innerHTML = html;
                })
                .catch(err => console.log('Error loading popup:', err));

            }

    }


}

function closePopup(event) {
    // Check if the click event occurred on the overlay or the close icon
    if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('close-icon')) {
        document.querySelector('#popupSection').innerHTML = "";
    }
}

function createItem(type) {
    
    event.preventDefault();

    switch (type) {

        case "products":

            // Get the form data
            const cardName = document.getElementById('cardName').value;
            const price = document.getElementById('price').value;
            const labels = document.getElementById('labels').value;
            const image_location = document.getElementById('image_location').value;

            if (confirm("Are you sure you want to create  " + cardName + "?")) {
                fetch(`/admin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type,
                        cardName,
                        price,
                        labels,
                        image_location
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {

                    window.alert(data.message);
                    location.reload(); 

                })
                .catch(error => {
                    window.alert("Error creating item: " + error.message);
                });
            }

    }

}

function editItem(type) {
    
    event.preventDefault();

    switch (type) {

        case "products":

            // Get the form data
            const cardName = document.getElementById('cardName').value;
            const cardId = document.getElementById('cardId').value;
            const price = document.getElementById('price').value;
            const image_location = document.getElementById('image_location').value;

            if (confirm("Are you sure you want to edit  " + cardName + "?")) {
                fetch(`/admin/${type}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: cardId,
                        data: {
                            price,
                            image_location
                        }
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {

                    window.alert(data.message);
                    location.reload(); 

                })
                .catch(error => {
                    window.alert("Error editting item: " + error.message);
                });
            }

    }

}