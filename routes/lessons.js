// Strapi Methods
const { getLevel } = require('../strapi/levels.js');
const { getTopic, getTopicChallenges } = require('../strapi/topics.js');

const { addCompletedTopic, removeCompletedTopic } = require('../database/methods/users.js');

const { myCipher } = require('../app/cipher.js');

const axios = require('axios');

const isLive = process.env.APP_ENV == 'production';

module.exports.defineLessonRoutes = function(app) {

  // Lessons route
  app.get('/lessons', async (req, res) => {
    let userID = null;
    if(req.user){
      userID = req.user._id;
    }
    const props = { userID };

    /* SSR Levels */
    let levels = [];
    try {
      await axios.get(`${process.env.STRAPI_API_URL}/levels\
?populate[topics][populate]=FeaturedMedia\
&sort[0]=Level\
&filters[Level][$contains]=1\
`)
        .then(res => {
          levels = res.data.data;
        });
    } catch (e) {
    }

    const title = 'Lessons';
    const description = 'Complete free lessons and challenges to sharpen your skills.';

    props.title = title;
    props.description = description;
    props.levels = levels;

    if (isLive) {
      res.render('lessons', {
        title,
        description,
        p: myCipher(JSON.stringify(props)),
        isLive,
        levels,
      });
    } else {
      res.render('lessons', props);
    }
  });

  // Levels route
  app.get('/level/:levelID', async (req, res) => {
    const levelID = req.params.levelID;
    const level = await getLevel(levelID);
    const levelName = level ? level.attributes.Level : 'Unknown';
    const props = {
      levelName,
      levelID,
    };

    /* SSR Topics */
    let topics = [];
    try {
      await axios.get(`${process.env.STRAPI_API_URL}/levels/${levelID}?populate[topics][populate][0]=FeaturedMedia%2Cchallenges`)
        .then(res => {
          if(res.data){
            topics = res.data.data.attributes.topics.data;
          }
        });
    } catch(e) {
      console.log(e)
    }

    const title = levelName;
    const description = `Complete lessons and challenges to sharpen your skills in ${levelName}.`;

    props.title = title;
    props.description = description;
    props.topics = topics;

    if (isLive) {
      res.render('level', {
        title,
        description,
        p: myCipher(JSON.stringify(props)),
        isLive,
        topics,
        levelID,
      });
    } else {
      res.render('level', props);
    }
  });

  // Topics route
  app.get('/level/:levelID/topic/:topicID', async (req, res) => {
    const levelID = req.params.levelID;
    const level = await getLevel(levelID);
    const levelName = level ? level.attributes.Level : 'Unknown';

    const topicID = req.params.topicID;
    const topic = await getTopic(topicID);
    const topicName = topic ? topic.attributes.Topic : 'Unknown';

    let completed = false;
    if(req.user){
      let completedTopics = req.user.completedTopics || [];
      completedTopics.forEach((topic) => {
        if(topic.id == topicID){
          completed = true;
        } else if (topic.data) {
          if(topic.data.id == topicID){
            completed = true;
          }
        }
      });
    }

    /* SSR Challenges */
    let challenges = [];
    try {
      await axios.get(`${process.env.STRAPI_API_URL}/topics/${topicID}?populate[challenges][populate][0]=FeaturedMedia`)
        .then(res => {
          if(res.data){
            challenges = res.data.data.attributes.challenges.data;
          }
        });
    } catch(e) {
    }

    res.render('topic.jsx', {
      title: `${levelName} - ${topicName}`,
      description: `Complete lessons and challenges to sharpen your skills in ${levelName} - ${topicName}.`,
      levelID,
      levelName,
      topicID,
      topicName,
      completed,
      challenges,
    });
  });

  app.post('/level/:levelID/topic/:topicID', async (req, res) => {
    if(req.user && req.params.levelID && req.params.topicID){
      const topicData = await getTopic(req.params.topicID);
      const challenges = await getTopicChallenges(req.params.topicID);
      const topic = {
        levelID: req.params.levelID,
        topicID: req.params.topicID,
        ...topicData,
        challenges
      }
      addCompletedTopic(req.user._id, topic);
      res.send('success');
    }
  });

  app.post('/level/:levelID/topic/:topicID/reset', async (req, res) => {
    if(req.user && req.params.topicID){
      removeCompletedTopic(req.user._id, req.params.topicID);
      res.send('reset');
    }
  });
}
