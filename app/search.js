const feathers = require('@feathersjs/feathers');
const service = require('feathers-mongodb');
const search = require('feathers-mongodb-fuzzy-search');
const { connectToDB, getDB } = require('../database/db.js');

async function createSearchService(collection = '', searchIndexes = []){
	try{
		await connectToDB();
		const db = await getDB();

		// Create search service
		const feathersService = feathers();
		feathersService.use('/' + collection, service({
			Model: db.collection(collection),
			whitelist: ['$text', '$search', '$regex']
		}));
		// Create search service
		const SearchService = feathersService.service(collection);
		// Create searchIndexes
		searchIndexes.forEach((searchIndex) => {
			let index = {};
			index[searchIndex] = 'text';
			SearchService.Model.createIndex(index)
		})
		// Add search hooks
		SearchService.hooks({
			before: {
			  find: search({ fields: searchIndexes })
			}
		})

		return SearchService;

	} catch(err){
		console.log(`Error: ${err}`);
	}
}

module.exports = createSearchService;