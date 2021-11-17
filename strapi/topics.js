const axios = require('axios');

function getTopic(topicID){
	return axios.get(`${process.env.STRAPI_URL}/topics/${topicID}`)
		.then(res => res.data)
}

function getTopicChallenges(topicID){
	return axios.get(`${process.env.STRAPI_URL}/challenges`)
		.then(res => {
			if(res.data){
				var challenges = [];
				res.data.forEach((challenge) => {
					if(challenge.topic){
						if(topicID == challenge.topic.id){
							challenges = challenges.concat(challenge);
						}
					}
				})
				return challenges;
			}
		}).then(challenges => challenges);
}

module.exports = { getTopic, getTopicChallenges }