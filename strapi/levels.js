const axios = require('axios');

function getLevel(levelID){
	return axios.get(`${process.env.STRAPI_API_URL}/levels/${levelID}`)
		.then(res => res.data)
		.then(data => data.data)
}

module.exports = { getLevel }