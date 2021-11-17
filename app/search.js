const feathers = require('@feathersjs/feathers');
const service = require('feathers-mongodb');
const search = require('feathers-mongodb-fuzzy-search');
const { connectToDB, getDB } = require('../database/db.js');

async function createVideoSearchService(){
	try{
		await connectToDB();
		const db = await getDB();

		// Create search service
		const feathersService = feathers();
		// Use videos for search
		feathersService.use('/videos', service({
			Model: db.collection('videos'),
			whitelist: ['$text', '$search']
		}));
		// Create video search service
		const VideoSearchService = feathersService.service('videos');
		// Create videos index
		VideoSearchService.Model.createIndex({ title: 'text' })
		// Add search hooks
		VideoSearchService.hooks({
			before: {
			  find: search()
			}
		})

		return VideoSearchService;

	} catch(err){
		console.log(`Error: ${err}`);
	}
}

module.exports = createVideoSearchService;