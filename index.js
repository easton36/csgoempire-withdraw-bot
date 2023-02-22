require('dotenv').config();
const io = require('socket.io-client');

const CONFIG = require('./config');
const { fetchMetadata } = require('./utils/empire.util');

const initializeSocket = async () => {
	try{
		console.log('[EMPIRE] Initializing socket...');

		const metadata = await fetchMetadata();

		const socket = io(CONFIG.WS_URL, {
			transports: ['websocket'],
			path: '/s/',
			secure: true,
			rejectUnauthorized: false,
			reconnect: true,
			extraHeaders: { 'User-Agent': `${metadata?.user?.id} API Bot` }
		});

		// Listen for the following event to be emitted by the socket in success cases
		socket.on('connect', () => console.log('[EMPIRE] Socket connected!'));
		socket.on('init', (data) => {
			if(data?.authenticated){
				console.log('[EMPIRE] Socket authenticated!');

				// emit price filters
				socket.emit('filters', {
					max_price: CONFIG.MAX_PRICE * 100,
					min_price: CONFIG.MIN_PRICE * 100
				});
			} else{
				console.log('[EMPIRE] Authenticating socket...');
				socket.emit('identify', {
					uid: metadata?.user?.id,
					model: metadata?.user,
					authorizationToken: metadata?.socket_token,
					signature: metadata?.socket_signature
				});
			}
		});
		// when a new item is listed
		socket.on('new_item', (data) => {
			console.log(`[EMPIRE] ${data?.length} new items listed!`);
			Promise.all(data.map(async (item) => {
				console.log(`[EMPIRE] New item listed: ${item?.market_name} (${item?.market_value / 100} coins)`);

				// emit a buy order for the item
			}));
		});

		// Listen for the following event to be emitted by the socket in error cases
		socket.on('close', (reason) => console.log(`Socket closed: ${reason}`));
		socket.on('error', (data) => console.log(`WS Error: ${data}`));
		socket.on('connect_error', (data) => console.log(`Connect Error: ${data}`));
	} catch(err){
		console.error(`[EMPIRE] Error initializing socket: ${err.message}`);
	}
};

initializeSocket();