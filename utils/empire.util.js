const axios = require('axios');
const { HTTP_URL } = require('../config');

const instance = axios.create({
	baseUrl: HTTP_URL,
	headers: {
		Authorization: `Bearer ${process.env.CSGOEMPIRE_TOKEN}`
	}
});

const fetchMetadata = async () => {
	try{
		const response = await instance.get('/metadata/socket');

		return response.data;
	} catch(error){
		console.error(`[EMPIRE] Error fetching metadata: ${error?.response?.data?.message || error.message}`);
	}
};

module.exports = {
	fetchMetadata
};