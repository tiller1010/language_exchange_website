const axios = require('axios');

function getLevel(levelID){
	return axios.get(`${process.env.STRAPI_API_URL}/levels/${levelID}`)
		.then(res => res.data)
		.then(data => data.data)
		.catch((e) => console.log('Connection to Strapi server could not be made.'))
}

async function searchLessons(_, { topicQuery, languageOfTopic }){
	if (topicQuery) {
		const endpoint = `${process.env.STRAPI_API_URL}/levels/\
?populate[topics][filters][challenges][Title][$contains]=${encodeURIComponent(topicQuery)}\
&populate[topics][populate][0]=FeaturedMedia\
&populate[topics][populate][FeaturedMedia][populate]=*\
&populate[topics][populate][1]=challenges\
&populate[topics][populate][challenges][filters][Title][$contains]=${encodeURIComponent(topicQuery)}\
&populate[topics][populate][challenges][populate]=FeaturedMedia\
&sort[0]=Level\
&filters[topics][challenges][Title][$contains]=${encodeURIComponent(topicQuery)}\
&filters[topics][Topic][$contains]=${encodeURIComponent(languageOfTopic)}\
`;
		let topicChallenges = axios.get(endpoint)
			.then(res => res.data)
			.catch((e) => console.log('Connection to Strapi server could not be made.'))
		topicChallenges = await topicChallenges.then(data => data ? data.data : null);
		if (topicChallenges.length) {
			return { levels: topicChallenges, showChallenge: true };
		}
	}

	let levels = axios.get(`${process.env.STRAPI_API_URL}/levels\
?populate[topics][filters][Topic][$contains]=${encodeURIComponent(topicQuery)}\
&populate[topics][populate][0]=FeaturedMedia\
&sort[0]=Level\
&filters[topics][Topic][$contains]=${encodeURIComponent(topicQuery)}\
&filters[Level][$contains]=${encodeURIComponent(languageOfTopic)}\
`)
		.then(res => res.data)
		.catch((e) => console.log('Connection to Strapi server could not be made.'))
	levels = levels.then(data => data ? data.data : null);

	return { levels, showChallenge: false };
}

module.exports = { getLevel, searchLessons }