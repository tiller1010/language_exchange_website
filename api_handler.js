const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const videos = require('./videos.js');
const likes = require('./likes.js');
const users = require('./users.js');
const premiumVideoChatListings = require('./premium-video-chat-listings.js');

const resolvers = {
	Query: {
		indexVideos: videos.indexVideos
	},
	Mutation: {
		addLike: likes.addLike,
		removeLike: likes.removeLike,
		verifyUser: users.verifyUser,
		addPremiumVideoChatListing: premiumVideoChatListings.addPremiumVideoChatListing,
		removePremiumVideoChatListing: premiumVideoChatListings.removePremiumVideoChatListing
	}
}

const server = new ApolloServer({
	typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
	resolvers
});

async function installHandler(app){
	await server.start();
	server.applyMiddleware({ app, path: '/graphql' });
}

module.exports = { installHandler }