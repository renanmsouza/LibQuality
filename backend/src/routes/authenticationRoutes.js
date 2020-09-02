const authenticationController = require('../controllers/authenticationController');

module.exports = function(app) {
    const auth = new authenticationController();

    app.post('/authentication/github', function(req, res) {
        auth.post(req, res);
    })
}