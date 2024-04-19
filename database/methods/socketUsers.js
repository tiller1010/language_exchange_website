const { getDB } = require('../db.js');

const addSocketUser = async (socketID, userID) => {
  const db = getDB();
  const user = await getSocketUserByUserID(userID);
  if (user) return;
  const result = await db.collection('socketUsers').insertOne({ socketID, userID });
  return result;
}

const getSocketUserByUserID = async (userID) => {
  const db = getDB();
  const user = await db.collection('socketUsers').findOne({ userID });
  return user;
}

const deleteSocketUser = async (socketID) => {
  const db = getDB();
  const user = await db.collection('socketUsers').findOne({ socketID });
  const userID = user ? user.userID : null;
  const result = await db.collection('socketUsers').deleteOne({ socketID });
  if (userID) {
    await db.collection('socketUsers').deleteMany({ userID });
  }
  return result;
}

module.exports = {
  addSocketUser,
  getSocketUserByUserID ,
  deleteSocketUser,
};

