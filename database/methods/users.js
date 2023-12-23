const fs = require('fs');
const path = require('path');
const { getDB } = require('../db.js');
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const createSearchService = require('../../app/search.js');
const { sendEmail } = require('../../app/email.js');

function randomString(limit = 40) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i = 0; i < limit; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function addUser(user){
  const db = getDB();
  const newUser = await db.collection('users').insertOne(user);
  return newUser;
}

async function findAndSyncUser(identifier, strategy){
  const db = getDB();
  let findObject = {};
  switch(strategy){
    case 'id':
      findObject = { _id: new mongo.ObjectID(identifier) };
    break;
    case 'local':
      findObject = { displayName: identifier };
    break;
    case 'google':
      findObject = { googleID: identifier };
    break;
  }
  let user = await db.collection('users').findOne(findObject);
  if(user){
    // Sync uploaded videos
    if(user.uploadedVideos){
      let syncedUploads = [];
      for(video of user.uploadedVideos){
        if(video){
          let upToDateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(video._id) });
          syncedUploads.push(upToDateVideo);
        }
      }
      await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { uploadedVideos: syncedUploads } });
      user = await db.collection('users').findOne(findObject);
    }
    // Sync liked videos
    if(user.likedVideos){
      let syncedLikes = [];
      for(video of user.likedVideos){
        if(video){
          let upToDateVideo = await db.collection('videos').findOne({ _id: new mongo.ObjectID(video._id) });
          syncedLikes.push(upToDateVideo);
        }
      }
      await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { likedVideos: syncedLikes } });
      user = await db.collection('users').findOne(findObject);
    }
  }
  return user;
}

async function findUserByID(id){
  const db = getDB();
  let user = await db.collection('users').findOne({ _id: new mongo.ObjectID(id) });
  return user;
}

async function graphql_findUserByID(_, { userID }){
  const db = getDB();
  let user = await findUserByID(userID);
  return user;
}

async function addCompletedTopic(userID, topic){
  const db = getDB();
  let user = await findUserByID(userID);
  // Sync completed topics
  let completedTopics = user.completedTopics || [];
  let topicAlreadyCompleted = false;
  completedTopics.forEach((completeTopic) => {
    if(topic.id == completeTopic.id){
      topicAlreadyCompleted = true;
    }
  });
  if(!topicAlreadyCompleted){
    completedTopics.push(topic);
  }
  await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { completedTopics } });
}

async function removeCompletedTopic(userID, topicID){
  const db = getDB();
  let user = await findUserByID(userID);
  // Sync completed topics
  let completedTopics = user.completedTopics || [];
  let newCompletedTopics = [];
  completedTopics.forEach((topic) => {
    if(topicID != topic.id){
      newCompletedTopics.push(topic);
    }
  });
  await db.collection('users').updateOne({ _id: new mongo.ObjectID(user._id) }, { $set: { completedTopics: newCompletedTopics } });
}

async function verifyUser(_, {userID, verificationStatus}){
  const db = getDB();
  await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: { verified: verificationStatus } });
  const user = await findUserByID(userID);
  return user;
}

async function addStripeAccountIDToUser(userID, connectedStripeAccountID){
  const db = getDB();
  const isLive = process.env.STRIPE_PUBLIC_KEY.match(/^pk_live_.*$/);
  let connectedStripeAccountIDKey = 'connectedStripeAccountID';
  if (isLive) {
    connectedStripeAccountIDKey = 'connectedStripeAccountID_Live';
  }
  const updateQueryObject = {};
  updateQueryObject[connectedStripeAccountIDKey] = connectedStripeAccountID;
  await db.collection('users').updateOne({ _id: new mongo.ObjectID(userID) }, { $set: updateQueryObject });
  const user = await findUserByID(userID);
  return user;
}

async function updateUser(_, { userID, user, profilePictureFile }){
  // Create file from upload
  if(profilePictureFile){
    var { createReadStream, filename, mimetype, encoding } = await profilePictureFile;
    var stream = createReadStream();
    var fileExtension = mimetype.split('').splice(mimetype.indexOf('/') + 1, mimetype.length).join('');
    var profilePictureSrc = 'assets/' + randomString(40) + '.' + fileExtension;
    var out = fs.createWriteStream(path.join(__dirname, '/../../public/') + profilePictureSrc);
    stream.pipe(out);
    user.profilePictureSrc = profilePictureSrc;
  }

  // Write to database
  const db = getDB();

  // Encrypt updated password
  if (user.password != '') {
    user.passwordHash = bcrypt.hashSync(user.password, 10);
  }
  delete user.password;

  const originalUser = await findUserByID(userID);
  const newEmail = user.email !== originalUser.email;

  let updatedUser = await db.collection('users').findOneAndUpdate(
    { _id: new mongo.ObjectID(userID) },
    { $set: { ...user } },
    { returnOriginal: false }
  );
  updatedUser = updatedUser.value;

  if (newEmail) {
    updatedUser = await setVerifiedEmail(userID, false);
  }

  return updatedUser;
}

async function getRecentUsers(_){
  const db = getDB();
  let users = await db.collection('users').find({}).sort({created: -1}).limit(10).toArray();

  return { users };
}

async function searchUsers(_, { searchQuery }){
  const db = getDB();
  let users = await db.collection('users').find({}).sort({created: -1}).limit(5).toArray();
  const UserSearchService = await createSearchService('users', ['displayName', 'firstName', 'lastName']);
  let query = {};
  if(searchQuery){
    var usersByDisplayName = await UserSearchService.find({ query: { displayName: { $search: searchQuery } } });
    var usersByFirstName = await UserSearchService.find({ query: { firstName: { $search: searchQuery } } });
    var usersByLastName = await UserSearchService.find({ query: { lastName: { $search: searchQuery } } });
    users = usersByDisplayName.concat(usersByFirstName).concat(usersByLastName);
    // Remove duplicate items
    users = users.reduce((accumulator, currentValue) =>
      accumulator.concat(accumulator.find(accumulatorItem => String(accumulatorItem._id) == String(currentValue._id)) ? [] : [currentValue])
    , []);
  }

  return { users };
}

async function setVerifiedEmail(userID, verificationStatus){
  const db = getDB();
  const updatedUser = await db.collection('users').findOneAndUpdate(
    { _id: new mongo.ObjectID(userID) },
    { $set: { verifiedEmail: verificationStatus } },
    { returnOriginal: false }
  );
  return updatedUser.value;
}

async function setNewPassword(userID, passwordHash) {
  const db = getDB();
  const updatedUser = await db.collection('users').findOneAndUpdate(
    { _id: new mongo.ObjectID(userID) },
    { $set: { passwordHash, resetPassword: false } },
    { returnOriginal: false }
  );
  return updatedUser.value;
}

async function updateUser_setForgotPasswordResetPassword(_, { email }){
  const db = getDB();
  // const resetPassword = 'random';
  const resetPassword = randomString(10);
  let updatedUser = await db.collection('users').findOneAndUpdate(
    { email },
    { $set: { resetPassword } },
    { returnOriginal: false }
  );
  updatedUser = updatedUser.value;

  var host = 'https://localhost:3000';
  if (process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL) {
    host = `https://${process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL}`;
  } else if (process.env.APP_PORT) {
    host = `https://localhost:${process.env.APP_PORT}`;
  }

  await sendEmail(email, `Password Reset`, `You have requested a password reset.\
<a href="${host}/reset-password?userID=${updatedUser._id}">Click here to reset your password.</a>\
<b>Reset Password: ${resetPassword}</b>`,
    (account) => console.log(account)
  );

  return updatedUser.value;
}

module.exports = {
  addUser,
  updateUser,
  updateUser_setForgotPasswordResetPassword,
  findAndSyncUser,
  findUserByID,
  graphql_findUserByID,
  addCompletedTopic,
  removeCompletedTopic,
  verifyUser,
  addStripeAccountIDToUser,
  getRecentUsers,
  searchUsers,
  setVerifiedEmail,
  setNewPassword,
};
