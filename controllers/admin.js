const path = require("path").resolve(__dirname, "..");
const productsService = require("../services/products");
const storesService = require("../services/stores");
const ordersService = require("../services/orders");
const { compile } = require("ejs");


async function getPopUp(req, res) {

    const type = req.params.type;

    switch (type) {

        case "products":
            
            const action = req.query.action;

            var renderObject = {
        
                action
        
            }
        
            if (action == "Edit") {
        
                const cardName = req.query.cardName;
                const object = await productsService.getProduct(cardName);
                const combinedObj = Object.assign({}, renderObject, object._doc);
                console.log(combinedObj);
        
                return res.render('productsPopup', combinedObj);
        
        
            }
            return res.render('productsPopup', renderObject);

    }

}


async function showAdminView(req, res) {

    // extract data from session
    var sessionCostumer = req.session.customer;
    var isAuthenticated = sessionCostumer ? true : false;

    const items = await productsService.getAllProducts();
    const chunkSize = 4;
    let result = [];

    for (let i = 0; i < items.length; i += chunkSize) {
        // Create a chunk of 4 items and push to result
        result.push(items.slice(i, i + chunkSize));
    }

    if (isAuthenticated) {

        var isAdmin = sessionCostumer.isAdmin;

        if (isAdmin) {

            res.render("admin", {

                root: path,
                isAuthenticated: isAuthenticated,
                items: result,
                isAdmin: isAdmin

            });

        }
        else {

            res.redirect('/');

        }

    }
    else {

        res.redirect('/login');

    }
    
  }


async function deleteItem(req,res) {

    const ID = req.params.id;
    const type = req.params.type;
    let response = null;

    try {
        switch (type) {
            case 'products':

                response = await productsService.removeProduct(ID);
                console.log(response);
                return res.send(response);

            case 'orders':

                response = await ordersService.removeOrder(ID);
                console.log(response);
                return res.send(response);

            case 'stores':

                response = await storesService.removeStore(ID);
                console.log(response);
                return res.send(response);

            default:

                return res.status(404).send({ status: 404, message: "Type not supported" });
        }
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }

}


async function editItem(req, res) {

    const ID = req.body.id;
    const type = req.params.type;
    const data = req.body.data;
    let response = null;

    try {
        switch (type) {
            case 'products':

                response = await productsService.editProduct(ID, data);
                console.log(response);
                return res.send(response);

            case 'orders':

                response = await ordersService.editOrder(ID, data);
                console.log(response);
                return res.send(response);

            case 'stores':

                response = await storesService.editStore(ID, data);
                console.log(response);
                return res.send(response);

            default:

                return res.status(404).send({ status: 404, message: "Type not supported" });
        }
    } catch (error) {
        console.error("Error editing item:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }

}


async function createItem(req, res) {

    const type = req.body.type;

    switch (type) {

        case "products":

            // unpack the item
            const { cardName, price, labels, image_location } = req.body;

            // Process the received data (e.g., save to database)
            console.log('Received product data:', {
                cardName,
                price,
                labels,
                image_location,
            });

            const response = await productsService.createProduct(cardName, price, labels, image_location);

            return res.send(response);

        default:

            return res.status(404).send({ status: 404, message: "Type not supported" });
    }
    

}

module.exports = {
    showAdminView,
    deleteItem,
    createItem,
    getPopUp,
    editItem
}