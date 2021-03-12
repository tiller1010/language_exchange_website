const { getDB } = require('./db.js');
const { MongoClient } = require('mongodb');
const mongo = require('mongodb');

async function addLike(userID, videoID){
	const db = getDB();
	// const newLike = {
	// 	userID = user._id,
	// 	videoID = video._id
	// }
	// const like = await db.collection('likes').insertOne(newLike);
	// return like;

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

async function findUserLikes(user){
	const db = getDB();
	// const likes = db.collection('likes').find({ userID: user._id }).toArray();
	// let likedVideos = [];
	// likes.forEach((like) => {
	// 	let video = await db.collection('videos').findOne({ _id: like.videoID });
	// 	likedVideos.push(video);
	// });
	// return likedVideos;
}

async function findVideoLikeCount(video){
	const db = getDB();
	// const likes = db.collection('likes').find({ videoID: video._id }).count();
	// return likes;
}

module.exports = { addLike, findUserLikes, findVideoLikeCount };