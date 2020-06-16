const app = require('./app');
require('dotenv').config();

app.listen(process.env.PORT, () => {
	console.log(`App running on port http://localhost:${process.env.PORT}`);
});
