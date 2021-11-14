const { getDB } = require('./db.js');
const mongo = require('mongodb');

async function addPremiumVideoChatListing(_, { userID, premiumVideoChatListing }){
	const db = getDB();

	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });

	if(!user.premiumVideoChatListing){
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { premiumVideoChatListing } });
		return premiumVideoChatListing;
	}

	return false;
}

async function removePremiumVideoChatListing(_, { userID }){
	const db = getDB();

	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });

	if(user.premiumVideoChatListing){
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $unset: 'premiumVideoChatListing' });
		return true;
	}
	
	return false;
}

module.exports = { addPremiumVideoChatListing, removePremiumVideoChatListing };