const projectController = require('../controllers/projectController');
const issueController = require('../controllers/issueController');

module.exports = function(app) {
    //This route have Query parameters
    app.get('/project', function(req, res) {
        const project = new projectController(req, res);
        project.setProject();
    })

    app.get('/issues', function(req, res) {
        const issue = new issueController(req, res);
        issue.setIssues();
    })
}