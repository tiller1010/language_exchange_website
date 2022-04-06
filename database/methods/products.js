const { getDB } = require('../db.js');
const mongo = require('mongodb');
const { createOrder } = require('../../app/stripe.js');

async function createProduct(_, { productObjectCollection, productDescription, productObjectID, userID, productObjectUpdateData = null }){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	let productObject;
	if(productObjectUpdateData){
		 productObject = await db.collection(productObjectCollection).findOneAndUpdate(
			{ _id: new mongo.ObjectID(productObjectID) },
			{ $set: JSON.parse(productObjectUpdateData) },
			{ returnOriginal: false }
		);
		productObject = productObject.value;

		switch(productObjectCollection){
			case 'premium_video_chat_listings':
				await db.collection('users').updateOne({ _id: new mongo.ObjectID(productObject.userID) }, { $set: { premiumVideoChatListing: productObject } });
			break;
		}
	} else {
		productObject = await db.collection(productObjectCollection).findOne({ _id: new mongo.ObjectID(productObjectID) });
	}
	const stripePrice = await createOrder(user.email, productDescription, Math.floor(productObject.price * 100), productObject.currency);
	let products = user.products || [];
	const product = {
		userID,
		cost: productObject.price,
		currency: productObject.currency,
		orderedOn: new Date().toDateString(),
		productObject,
		productObjectCollection,
		// priceID: invoice.price.id <- if using invoices
		priceID: stripePrice.id,
		status: 'Unpaid',
	}
	products.push(product);
	user = await db.collection('users').findOneAndUpdate(
		{ _id: new mongo.ObjectID(userID) },
		{ $set: { products } },
		{ returnOriginal: false }
	);
	user = user.value;

	return product;
}

async function completeOrder(userID, priceID){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	if(user.products){
		let userProducts = user.products;
		userProducts.forEach((product) => {
			if(product.priceID == priceID){
				product.status = 'Paid';
			}
		});
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { products: userProducts } });
	}
	return;
}

module.exports = { createProduct, completeOrder };