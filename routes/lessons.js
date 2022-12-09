const { myCipher } = require('../app/cipher.js');

const isLive = process.env.APP_ENV == 'production';

module.exports.defineLessonRoutes = function(app) {

	// Lessons route
	app.get('/lessons', (req, res) => {
		let userID = null;
		if(req.user){
			userID = req.user._id;
		}
		res.render('lessons', { userID });
	});

	// Levels route
	app.get('/level/:levelID', async (req, res) => {
		const levelID = req.params.levelID;
		const level = await getLevel(levelID);
		const levelName = level ? level.attributes.Level : 'Unknown';
		if (isLive) {
			res.render('level', { p: myCipher(JSON.stringify({ levelName, levelID })), isLive });
		} else {
			res.render('level', {
				levelName,
				levelID,
				isLive,
			});
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
		res.render('topic.jsx', {
			levelID,
			levelName,
			topicID,
			topicName,
			completed,
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