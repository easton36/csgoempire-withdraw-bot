const axios = require('axios');

const fetchPriceData = async () => {
	try{
		const response = await axios.get('');
	} catch(err){
		console.error(`[EMPIRE] Error fetching price data: ${err.message}`);
	}
};