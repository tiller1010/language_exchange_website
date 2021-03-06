const { getDB } = require('./db.js');

async function add(user){
	const db = getDB();
	const newUser = await db.collection('users').insertOne(user);
	return newUser;
}

async function find(userID){
	const db = getDB();
	const newUser = await db.collection('users').findOne({ googleID: userID });
	return newUser;
}


module.exports = { addUser: add, findUser: find };