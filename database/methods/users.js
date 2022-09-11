const fs = require('fs');
const path = require('path');
const { getDB } = require('../db.js');
const mongo = require('mongodb');
const bcrypt = require('bcrypt');

function randomFilename() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < 40; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function addUser(user){
	const db = getDB();
	const newUser = await db.collection('users').insertOne(user);
	return newUser;
}

async function findAndSyncUser(identifier, strategy){
	const db = getDB();
	let findObject = {};
	switch(strategy){
		case 'id':
			findObject = { _id: new mongo.ObjectID(identifier) };
		break;
		case 'local':
			findObject = { displayName: identifier };
		break;
		case 'google':
			findObject = { googleID: identifier };
		break;
	}
	let user = await db.collection('users').findOne(findObject);
	if(user){
		// Sync uploaded videos
		if(user.uploadedVideos){
			let syncedUploads = [];
			for(video of user.uploadedVideos){
				if(video){
					let upToDateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(video._id) });
					syncedUploads.push(upToDateVideo);
				}
			}
			await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { uploadedVideos: syncedUploads } });
			user = await db.collection('users').findOne(findObject);
		}
		// Sync liked videos
		if(user.likedVideos){
			let syncedLikes = [];
			for(video of user.likedVideos){
				if(video){
					let upToDateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(video._id) });
					syncedLikes.push(upToDateVideo);
				}
			}
			await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { likedVideos: syncedLikes } });
			user = await db.collection('users').findOne(findObject);
		}
	}
	return user;
}

async function findUserByID(id){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(id) });
	return user;
}

async function graphql_findUserByID(_, { userID }){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	return user;
}

async function addCompletedTopic(userID, topic){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	// Sync completed topics
	let completedTopics = user.completedTopics || [];
	let topicAlreadyCompleted = false;
	completedTopics.forEach((completeTopic) => {
		if(topic.id == completeTopic.id){
			topicAlreadyCompleted = true;
		}
	});
	if(!topicAlreadyCompleted){
		completedTopics.push(topic);
	}
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { completedTopics } });
}

async function removeCompletedTopic(userID, topicID){
	const db = getDB();
	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	// Sync completed topics
	let completedTopics = user.completedTopics || [];
	let newCompletedTopics = [];
	completedTopics.forEach((topic) => {
		if(topicID != topic.id){
			newCompletedTopics.push(topic);
		}
	});
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { completedTopics: newCompletedTopics } });
}

async function verifyUser(_, {userID, verificationStatus}){
	const db = getDB();
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { verified: verificationStatus } });
	const user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	return user;
}

async function addStripeAccountIDToUser(userID, connectedStripeAccountID){
	const db = getDB();
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { connectedStripeAccountID } });
	const user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	return user;
}

async function updateUser(_, { userID, user, profilePictureFile }){
	// Create file from upload
	if(profilePictureFile){
		var { createReadStream, filename, mimetype, encoding } = await profilePictureFile;
		var stream = createReadStream();
		var fileExtension = mimetype.split('').splice(mimetype.indexOf('/') + 1, mimetype.length).join('');
		var profilePictureSrc = 'assets/' + randomFilename() + '.' + fileExtension;
		var out = fs.createWriteStream(path.join(__dirname, '/../../public/') + profilePictureSrc);
		stream.pipe(out);
		user.profilePictureSrc = profilePictureSrc;
	}

	// Write to database
	const db = getDB();

	// Encrypt updated password
	if (user.password != '') {
		user.passwordHash = bcrypt.hashSync(user.password, 10);
	}
	delete user.password;


	user = await db.collection('users').findOneAndUpdate(
		{ _id: new mongo.ObjectID(userID) },
		{ $set: { ...user } },
		{ returnOriginal: false }
	);
	user = user.value;
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(user.userID) }, { $set: { user } });
	return user;

	return false;
}


module.exports = { addUser, updateUser, findAndSyncUser, findUserByID, graphql_findUserByID, addCompletedTopic, removeCompletedTopic, verifyUser, addStripeAccountIDToUser };