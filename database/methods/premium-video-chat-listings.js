const fs = require('fs');
const path = require('path');
const { getDB } = require('../db.js');
const mongo = require('mongodb');
const createSearchService = require('../../app/search.js');
const { findUserByID } = require('./users.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

function randomFilename() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 40; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function getRecentPremiumVideoChatListings(_){
	const db = getDB();
	let premiumVideoChatListings = await db.collection('premium_video_chat_listings').find({}).sort({created: -1}).limit(5).toArray();

	// Only show purchasable listings
	let purchasablePremiumVideoChatListings = [];
	for(listing of premiumVideoChatListings){
		const user = await findUserByID(listing.userID);
		if(user){
			if(user.connectedStripeAccountID){
				const account = await stripe.accounts.retrieve(user.connectedStripeAccountID);
				if(account.charges_enabled && account.payouts_enabled){
					purchasablePremiumVideoChatListings.push(listing);
				}
			}
		}
	}

	return { listings: purchasablePremiumVideoChatListings };
}

async function searchPremiumVideoChatListings(_, { topic, languageOfTopic }){
	const db = getDB();
	const ListingSearchService = await createSearchService('premium_video_chat_listings', ['topic', 'languageOfTopic']);
	let query = {};
	if(topic){
		query.topic = { $search: topic };
	}
	if(languageOfTopic){
		query.languageOfTopic = { $search: languageOfTopic };
	}
	let listings = await ListingSearchService.find({ query });

	// Only show purchasable listings
	let purchasablePremiumVideoChatListings = [];
	for(listing of listings){
		const user = await findUserByID(listing.userID);
		if(user.connectedStripeAccountID){
			const account = await stripe.accounts.retrieve(user.connectedStripeAccountID);
			if(account.charges_enabled && account.payouts_enabled){
				purchasablePremiumVideoChatListings.push(listing);
			}
		}
	}

	return { listings: purchasablePremiumVideoChatListings };
}

async function addPremiumVideoChatListing(_, { userID, premiumVideoChatListing, thumbnailFile }){
	// Create file from upload
	const { createReadStream, filename, mimetype, encoding } = await thumbnailFile;
	const stream = createReadStream();
	const fileExtension = mimetype.split('').splice(mimetype.indexOf('/') + 1, mimetype.length).join('');
	const thumbnailSrc = 'assets/' + randomFilename() + '.' + fileExtension;
	const out = fs.createWriteStream(path.join(__dirname, '/../../public/') + thumbnailSrc);
	stream.pipe(out);

	// Write to database
	const db = getDB();

	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });

	if(!user.premiumVideoChatListing){
		premiumVideoChatListing.thumbnailSrc = thumbnailSrc;
		premiumVideoChatListing = await db.collection('premium_video_chat_listings').insertOne({ userID, ...premiumVideoChatListing }).then(({ ops }) => ops[0]);
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { premiumVideoChatListing } });
		return premiumVideoChatListing;
	}

	return false;
}

async function addPremiumVideoChatListingThumbnailTest(_, { variables, thumbnailFile }){
	// Create file from upload
	const { createReadStream, filename, mimetype, encoding } = await thumbnailFile;
	const stream = createReadStream();
	const fileExtension = mimetype.split('').splice(mimetype.indexOf('/') + 1, mimetype.length).join('');
	const thumbnailSrc = 'assets/' + randomFilename() + '.' + fileExtension;
	const out = fs.createWriteStream(path.join(__dirname, '/../../public/') + thumbnailSrc);
	stream.pipe(out);

	return { thumbnailSrc };
}

async function updatePremiumVideoChatListing(_, { listingID, premiumVideoChatListing, thumbnailFile }){
	// Create file from upload
	if(thumbnailFile){
		var { createReadStream, filename, mimetype, encoding } = await thumbnailFile;
		var stream = createReadStream();
		var fileExtension = mimetype.split('').splice(mimetype.indexOf('/') + 1, mimetype.length).join('');
		var thumbnailSrc = 'assets/' + randomFilename() + '.' + fileExtension;
		var out = fs.createWriteStream(path.join(__dirname, '/../../public/') + thumbnailSrc);
		stream.pipe(out);
		premiumVideoChatListing.thumbnailSrc = thumbnailSrc;
	}

	// Write to database
	const db = getDB();

	premiumVideoChatListing = await db.collection('premium_video_chat_listings').findOneAndUpdate(
		{ _id: new mongo.ObjectID(listingID) },
		{ $set: { ...premiumVideoChatListing } },
		{ returnOriginal: false }
	);
	premiumVideoChatListing = premiumVideoChatListing.value;
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(premiumVideoChatListing.userID) }, { $set: { premiumVideoChatListing } });
	return premiumVideoChatListing;

	return false;
}

async function removePremiumVideoChatListing(_, { userID }){
	const db = getDB();

	let originalUser = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });

	if(originalUser.premiumVideoChatListing){
		originalUser = await db.collection('users').findOneAndUpdate({ _id: new mongo.ObjectID(userID) }, { $unset: { premiumVideoChatListing: '' } });
		originalUser = originalUser.value;
		await db.collection('premium_video_chat_listings').deleteOne({ _id: new mongo.ObjectID(originalUser.premiumVideoChatListing._id) });
		return true;
	}
	
	return false;
}

module.exports = {
	getRecentPremiumVideoChatListings,
	searchPremiumVideoChatListings,
	addPremiumVideoChatListing,
	addPremiumVideoChatListingThumbnailTest,
	updatePremiumVideoChatListing,
	removePremiumVideoChatListing
};