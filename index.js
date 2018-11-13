const app = require('./app')
const config = require('./config.json')

app.listen(config.port, () => {
	console.log(`App running on port ${config.port}`);
});
