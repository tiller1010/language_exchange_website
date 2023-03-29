const { myCipher } = require('../app/cipher.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET || '');
const { getRecentPremiumVideoChatListings } = require('../database/methods/premium-video-chat-listings.js');
const { findUserByID } = require('../database/methods/users.js');

const isLive = process.env.APP_ENV == 'production';

module.exports.defineVideoChatRoutes = function(app) {

  // Chats route
  app.get('/chats', async (req, res) => {
    let authenticatedUserID = null;
    if(req.user){
      authenticatedUserID = req.user._id;
    }
    const props = { authenticatedUserID };

    /* SSR Chats */
    let premiumVideoChatListings = await getRecentPremiumVideoChatListings(null);
    premiumVideoChatListings = premiumVideoChatListings.listings;
    props.premiumVideoChatListings = premiumVideoChatListings;

    if (isLive) {
      return res.render('chats', { p: myCipher(JSON.stringify(props)), isLive, premiumVideoChatListings });
    } else {
      res.render('chats', props);
    }
  });

  app.get('/video-chat', async (req, res) => {
    let userID = null;
    if(req.user){
      userID = req.user._id;
    } else {
      return res.redirect(`/login?backURL=${req.originalUrl}`);
    }
    const props = { authenticatedUserID: userID };
    if (isLive) {
      return res.render('video-chat', { p: myCipher(JSON.stringify(props)), isLive });
    } else {
      return res.render('video-chat', props);
    }
  });
  app.post('/video-chat-tokens', async (req, res) => {
    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.SECURED_DOMAIN_WITHOUT_PROTOCOL || 'localhost',
    };
    return res.json(firebaseConfig);
  });
}
