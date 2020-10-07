const { getDB } = require('./db.js');

async function index(){
	const db = getDB();
	const videos = await db.collection('videos').find({}).toArray();
	return videos;
}

module.exports = { index };