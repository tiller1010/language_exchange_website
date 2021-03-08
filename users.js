const { getDB } = require('./db.js');

async function add(user){
	const db = getDB();
	const newUser = await db.collection('users').insertOne(user);
	return newUser;
}

async function find(identifier, strategy){
	const db = getDB();
	let findObject = {};
	switch(strategy){
		case 'local':
			findObject = { displayName: identifier };
		break;
		case 'google':
			findObject = { googleID: identifier };
		break;
	}
	const newUser = await db.collection('users').findOne(findObject);
	return newUser;
}


module.exports = { addUser: add, findUser: find };