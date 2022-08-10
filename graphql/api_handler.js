const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLUpload } = require('graphql-upload');
const videos = require('../database/methods/videos.js');
const likes = require('../database/methods/likes.js');
const users = require('../database/methods/users.js');
const premiumVideoChatListings = require('../database/methods/premium-video-chat-listings.js');
const products = require('../database/methods/products.js');

const resolvers = {
	Upload: GraphQLUpload,
	Query: {
		// Videos
		indexVideos: videos.indexVideos,
		// Users
		findUserByID: users.graphql_findUserByID,
		// Premium Video Chat Listings
		getRecentPremiumVideoChatListings: premiumVideoChatListings.getRecentPremiumVideoChatListings,
		searchPremiumVideoChatListings: premiumVideoChatListings.searchPremiumVideoChatListings,
	},
	Mutation: {
		// Likes
		addLike: likes.addLike,
		removeLike: likes.removeLike,
		// Users
		verifyUser: users.verifyUser,
		updateUser: users.updateUser,
		// Premium Video Chat Listings
		addPremiumVideoChatListing: premiumVideoChatListings.addPremiumVideoChatListing,
		addPremiumVideoChatListingThumbnailTest: premiumVideoChatListings.addPremiumVideoChatListingThumbnailTest,
		updatePremiumVideoChatListing: premiumVideoChatListings.updatePremiumVideoChatListing,
		removePremiumVideoChatListing: premiumVideoChatListings.removePremiumVideoChatListing,
		// Products
		createProduct: products.createProduct,
	}
}

const server = new ApolloServer({
	typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
	resolvers
});

async function installHandler(app){
	await server.start();
	server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler }