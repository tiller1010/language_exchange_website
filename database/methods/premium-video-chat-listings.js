const fs = require('fs');
const path = require('path');
const { getDB } = require('../db.js');
const mongo = require('mongodb');
const createSearchService = require('../../app/search.js');

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
	const premiumVideoChatListings = await db.collection('premium_video_chat_listings').find({}).sort({created: -1}).limit(5).toArray();
	return { listings: premiumVideoChatListings };
}

async function searchPremiumVideoChatListings(_, { topic, language }){
	const db = getDB();
	const ListingSearchService = await createSearchService('premium_video_chat_listings', ['topic', 'language']);
	let query = {};
	if(topic){
		query.topic = { $search: topic };
	}
	if(language){
		query.language = { $search: language };
	}
	const listings = await ListingSearchService.find({ query });
	return { listings };
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
		{returnOriginal: false}
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