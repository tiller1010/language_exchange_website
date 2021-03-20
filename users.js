const { getDB } = require('./db.js');
const mongo = require('mongodb');

async function addUser(user){
	const db = getDB();
	const newUser = await db.collection('users').insertOne(user);
	return newUser;
}

async function findAndSyncUser(identifier, strategy){
	const db = getDB();
	let findObject = {};
	switch(strategy){
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
			let syncedUploads = [];
			for(video of user.likedVideos){
				if(video){
					let upToDateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(video._id) });
					syncedUploads.push(upToDateVideo);
				}
			}
			await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { likedVideos: syncedUploads } });
			user = await db.collection('users').findOne(findObject);
		}
	}
	return user;
}


module.exports = { addUser, findAndSyncUser };