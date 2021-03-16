const { getDB } = require('./db.js');
const mongo = require('mongodb');

async function addLike(userID, videoID){
	const db = getDB();

	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	let likedVideos = user.likedVideos || [];
	let video = await db.collection('videos').findOne({ _id: new mongo.ObjectID(videoID) });

	let videoAlreadyLiked = false;
	likedVideos.forEach((likedVideo) => {
		if(String(likedVideo._id) == String(video._id)){
			videoAlreadyLiked = true;
		}
	});
	if(!videoAlreadyLiked){
		// Add like to video
		let videoLikes = video.likes || 0;
		await db.collection('videos').updateOne({ _id: new mongo.ObjectID(videoID) }, { $set: { likes: videoLikes + 1 } });

		// Insert the updated video to the users's liked videos
		const updateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(videoID) });
		likedVideos.push(updateVideo);
		await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { likedVideos } });

		return updateVideo;
	}
	return false;
}

async function removeLike(userID, videoID){
	const db = getDB();

	let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(userID) });
	let likedVideos = user.likedVideos || [];
	let video = await db.collection('videos').findOne({ _id: new mongo.ObjectID(videoID) });

	// Remove a like from video
	let videoLikes = video.likes || 0;
	await db.collection('videos').updateOne({ _id: new mongo.ObjectID(videoID) }, { $set: { likes: videoLikes - 1 } });
	const updateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(videoID) });

	// Remove the updated video from the users's liked videos
	let newUserLikedVideos = [];
	likedVideos.forEach((userLikedVideo) => {
		if(String(userLikedVideo._id) != String(videoID)){
			newUserLikedVideos.push(userLikedVideo)
		}
	});
	await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { likedVideos: newUserLikedVideos } });

	return updateVideo;
}

module.exports = { addLike, removeLike };