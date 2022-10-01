const { getDB } = require('../db.js');
const mongo = require('mongodb');
const { createOrder } = require('../../app/stripe.js');

async function createProduct(_, { productObjectCollection, productDescription, productObjectID, userID, productObjectUpdateData = null }){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });

	// Insert into products collections. Creates ID, key:value data is added later.
	let product = await db.collection('products').insertOne({});

	// Define blank product object and price
	let productObject;
	let price;

	// If we need to update the product's object document, do so
	if(productObjectUpdateData){

		// Pre-process update data
		productObjectUpdateData = JSON.parse(productObjectUpdateData);
		switch(productObjectCollection){
			case 'premium_video_chat_listings':
				let newTimeSlots = [];
				var purchasedTimeSlotsCount = 0;
				productObjectUpdateData.timeSlots.forEach((timeSlot) => {
					let newTimeSlot = {
						date: timeSlot.date,
						time: timeSlot.time,
						customerUserID: timeSlot.customerUserID,
						completed: timeSlot.completed,
						booked: timeSlot.booked,
						paid: timeSlot.paid,
					}
					if(timeSlot.shouldAddProductID){
						// Insert productID, and drop shouldAddProductID flag
						newTimeSlot.productID = String(product.insertedId);

						// Increase price per timeSlot
						purchasedTimeSlotsCount++; 
					}
					newTimeSlots.push(newTimeSlot);
				});
				productObjectUpdateData.timeSlots = newTimeSlots;
			break;
		}

		// Update and return product.productObject source
		productObject = await db.collection(productObjectCollection).findOneAndUpdate(
			{ _id: new mongo.ObjectID(productObjectID) },
			{ $set: productObjectUpdateData },
			{ returnOriginal: false }
		);
		productObject = productObject.value;

		// Post-process update data
		switch(productObjectCollection){
			case 'premium_video_chat_listings':
				// Update the owner user document
				await db.collection('users').updateOne({ _id: new mongo.ObjectID(productObject.userID) }, { $set: { premiumVideoChatListing: productObject } });

				// Filter for timeslots associated with this purchase. Inserted into customer user document and products collections.
				productObject.timeSlots = productObject.timeSlots.filter(timeSlot => timeSlot.productID == String(product.insertedId));

				// Multiply price by amount of timeslots
				price = (productObject.price * 100) * purchasedTimeSlotsCount;
			break;
		}

	// Default product data
	} else {
		productObject = await db.collection(productObjectCollection).findOne({ _id: new mongo.ObjectID(productObjectID) });
		price = productObject.price * 100;
	}

	// Create stripe order
	const stripePrice = await createOrder(user.email, productDescription, Math.floor(price), productObject.currency);

	// Update product document
	productUpdateData = {
		userID,
		cost: price,
		currency: productObject.currency,
		orderedOn: new Date().toDateString(),
		productObject,
		productObjectCollection,
		// priceID: invoice.price.id <- if using invoices
		priceID: stripePrice.id,
		status: 'Unpaid',
	}
	product = await db.collection('products').findOneAndUpdate(
		{ _id: product.insertedId },
		{ $set: { ...productUpdateData } },
		{ returnOriginal: false }
	);
	product = product.value;

	// Update customer user document	
	let products = user.products || [];
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
		userProducts.forEach( async (userProduct) => {
			if(userProduct.priceID == priceID){
				userProduct.status = 'Paid';
				var product = await db.collection('products').findOneAndUpdate(
					{ _id: userProduct._id },
					{ $set: { ...userProduct } },
					{ returnOriginal: false }
				);
				product = product.value;

				// Pre-process update data
				let productObject = await db.collection(product.productObjectCollection).findOne({ _id: new mongo.ObjectID(product.productObject._id) });
				let newProductObject = { ...productObject };
				switch (product.productObjectCollection) {
					case 'premium_video_chat_listings':
						newProductObject.timeSlots.forEach((timeSlot) => {
							if (String(timeSlot.productID) == String(userProduct._id)) {
								timeSlot.paid = true;
							}
						});
					break;
				}

				// Update and return product.productObject source
				productObject = await db.collection(product.productObjectCollection).findOneAndUpdate(
					{ _id: new mongo.ObjectID(product.productObject._id) },
					{ $set: { ...newProductObject } },
					{ returnOriginal: false }
				);
				productObject = productObject.value;

				// Post-process update data
				switch (product.productObjectCollection) {
					case 'premium_video_chat_listings':
						// Update the owner user document
						await db.collection('users').updateOne({ _id: new mongo.ObjectID(productObject.userID) }, { $set: { premiumVideoChatListing: productObject } });
					break;
				}
			}
		});
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { products: userProducts } });
	}
	return;
}

module.exports = { createProduct, completeOrder };