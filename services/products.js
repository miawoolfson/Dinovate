const Card = require('../models/products');


async function getAllProducts() {
    try {
        const products = await Card.find().exec(); 
        return products;
    } catch (error) {
        console.error('Error finding products: ', error);
        return null;
    }
}


async function removeProduct(productID) {

    const resp = await Card.deleteOne({cardId: productID}).then(result => {

        if (result.deletedCount == 0) {

            return Promise.reject({status: 500, message: "Product not found"});

        }
        return Promise.resolve({status: 200});

    }).catch(e => {

        return Promise.reject({status: 500, message: e});

    });

    return resp;

}


async function editProduct(productID, data) {

    try {

        const result = await Card.updateOne({ cardId: productID }, data, { 
            runValidators: true
        });

        if (result.modifiedCount == 0) {

            return ({status: 500, message: "Product not found"});

        }

        return ({status: 200, message: "Success"});

    } catch (e) {

        console.error('Error updating item:', e);
        return ({status: 500, message: e});

    }

}


async function createProduct(name, price, labels, image) {

    try {

        // Check if a card with the same cardName already exists
        const existingCard = await Card.findOne({ cardName: name });

        if (existingCard) {

            return {status: 400, message: 'Card name already exists.' };

        }

        // Create a new card
        const cardCount = await Card.countDocuments();
        const newCard = new Card({
            cardId: cardCount + 1,
            cardName: name,
            price,
            labels: labels.split(',').map(label => label.trim()), // Convert labels from comma-separated string to array
            image_location: image
        });

        // Save the new card to the database
        await newCard.save();

        return {
            status: 200, 
            message: 'Card created successfully'
        };
    
    } 
    catch (err) {

        console.error('Error creating card:', err.message);
        return {
            status: 500,
            message: `Error creating card: ${err.message}`
        };

    }

}


async function getProduct(cardName) {

    try {

        const product = await Card.findOne({ cardName });

        if (!product) {
            throw new Error('Product not found');
        }

        return product;

    } catch (err) {

        console.error(err.message);
        throw err;

    }

}

module.exports = {
    getAllProducts,
    removeProduct,
    editProduct,
    createProduct,
    getProduct
}