const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLUpload } = require('graphql-upload');
const videos = require('../database/methods/videos.js');
const likes = require('../database/methods/likes.js');
const users = require('../database/methods/users.js');
const premiumVideoChatListings = require('../database/methods/premium-video-chat-listings.js');

const resolvers = {
	Upload: GraphQLUpload,
	Query: {
		indexVideos: videos.indexVideos
	},
	Mutation: {
		addLike: likes.addLike,
		removeLike: likes.removeLike,
		verifyUser: users.verifyUser,
		addPremiumVideoChatListing: premiumVideoChatListings.addPremiumVideoChatListing,
		addPremiumVideoChatListingThumbnailTest: premiumVideoChatListings.addPremiumVideoChatListingThumbnailTest,
		removePremiumVideoChatListing: premiumVideoChatListings.removePremiumVideoChatListing
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