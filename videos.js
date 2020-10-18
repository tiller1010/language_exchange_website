const { getDB } = require('./db.js');
const fs = require('fs');

async function index(){
	const db = getDB();
	const videos = await db.collection('videos').find({}).toArray();
	return videos;
}

async function add(video){
	const db = getDB();
	const newVideo = await db.collection('videos').insertOne(video);
	return video;
}

module.exports = { index, add };