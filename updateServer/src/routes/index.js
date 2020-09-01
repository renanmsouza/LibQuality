const projectController = require('../controllers/projectController');
const issueController = require('../controllers/issueController');
const labelController = require('../controllers/labelController');
const statisticsController = require('../controllers/statisticController');

module.exports = function(app) {
    //This route have Query parameters
    app.get('/projects/add', function(req, res) {
        const project = new projectController(req, res);
        project.setProject();
    })

    app.get('/issues', function(req, res) {
        const issue = new issueController(req, res);
        issue.setIssues();
    })

    app.get('/labels', function(req, res) {
        const label = new labelController(req, res);
        label.setLabels();
    })

    app.get('/statistics', function(req, res) {
        const statistics = new statisticsController(req, res);
        statistics.calcStatistics();

        res.json({ calculated_at: Date.now() });
    })

    app.get('/', function(req, res) {
        res.json({ API: 'UpdateServer' });
    })
}