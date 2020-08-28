const projectController = require('../controllers/projectController');

module.exports = function(app) {
    app.get('/project', function(req, res) {
        const project = new projectController(req, res);
        project.project('react', 'facebook');
    })
}