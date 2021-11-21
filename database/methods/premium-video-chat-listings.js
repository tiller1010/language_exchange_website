const fs = require('fs');
const path = require('path');
const { getDB } = require('../db.js');
const mongo = require('mongodb');

function randomFilename() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 40; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
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
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { premiumVideoChatListing } });
		user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
		await db.collection('premium_video_chat_listings').insertOne({ user, ...premiumVideoChatListing });
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

async function removePremiumVideoChatListing(_, { userID }){
	const db = getDB();

	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });

	if(user.premiumVideoChatListing){
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $unset: 'premiumVideoChatListing' });
		return true;
	}
	
	return false;
}

module.exports = { addPremiumVideoChatListing, addPremiumVideoChatListingThumbnailTest, removePremiumVideoChatListing };