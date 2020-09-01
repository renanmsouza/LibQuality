const express =  require('express');
const consign = require('consign');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express();

app.use(express.Router());
app.use(express.json());
app.use(cookieParser());
app.use(session({
	secret: 'Project LibQuality',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
  }))

consign()
	.include('./src/routes')
	.into(app);

module.exports = () => {
    return app;
};