const express =  require('express');
const consign = require('consign');

const app = express();

app.use(express.Router());
app.use(express.json());

consign()
	.include('./src/routes')
	.into(app);

module.exports = () => {
    return app;
};