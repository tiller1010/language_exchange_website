const axios = require('axios');

function getLevel(levelID){
	return axios.get(`${process.env.STRAPI_API_URL}/levels/${levelID}`)
		.then(res => res.data)
		.then(data => data.data)
		.catch((e) => console.log('Connection to Strapi server could not be made.'))
}

function searchLessons(_, { topicQuery, languageOfTopic }){
	let levels = axios.get(`${process.env.STRAPI_API_URL}/levels?populate[topics][populate]=FeaturedMedia&sort[0]=Level&filters[topics][Topic][$contains]=${encodeURIComponent(topicQuery)}&filters[Level][$contains]=${encodeURIComponent(languageOfTopic)}`)
		.then(res => res.data)
		.catch((e) => console.log('Connection to Strapi server could not be made.'))
	levels = levels.then(data => data ? data.data : null);
	return { levels };
}

module.exports = { getLevel, searchLessons }