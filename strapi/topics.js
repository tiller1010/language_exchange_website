const axios = require('axios');

function getTopic(topicID){
	return axios.get(`${process.env.STRAPI_API_URL}/topics/${topicID}?populate=FeaturedMedia`)
		.then(res => res.data)
		.then(data => data.data)
}

function getTopicChallenges(topicID){
	return axios.get(`${process.env.STRAPI_API_URL}/challenges`)
		.then(res => res.data)
		.then(data => {
			if(data.data){
				var challenges = [];
				data.data.forEach((challenge) => {
					if(challenge.attributes.topic){
						if(topicID == challenge.attributes.topic.id){
							challenges = challenges.concat(challenge);
						}
					}
				})
				return challenges;
			}
		}).then(challenges => challenges);
}

module.exports = { getTopic, getTopicChallenges }