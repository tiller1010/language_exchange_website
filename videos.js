const { getDB } = require('./db.js');
const mongo = require('mongodb');

const pageLength = 6;
async function indexVideos(page = 1, sort = {}){
	const db = getDB();
	// Skip items per page, minus the current page
	const videos = await db.collection('videos').find({}).sort(sort).skip((page - 1) * pageLength).limit(pageLength).toArray();
	const videoCount = await db.collection('videos').count();
	const pages = Math.ceil(videoCount / pageLength);
	return {
		videos,
		pages
	}
}

async function addVideo(video){
	const db = getDB();
	const newVideo = await db.collection('videos').insertOne(video);
	return newVideo.ops[0];
}

async function removeVideo(videoID){
	const db = getDB();
	const newVideo = await db.collection('videos').deleteOne({ _id: new mongo.ObjectID(videoID) });
	return;
}

async function addVideoToUsersUploads(video, userID){
	const db = getDB();
	const user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	let usersUploads = user.uploadedVideos || [];
	usersUploads.push(video);
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { uploadedVideos: usersUploads } });
	return;
}

async function getRecent(limit = 6){
	const db = getDB();
	const videos = await db.collection('videos').find({}).sort({created: -1}).limit(5).toArray();
	return {videos};
}

module.exports = { indexVideos, addVideo, removeVideo, getRecent, addVideoToUsersUploads };