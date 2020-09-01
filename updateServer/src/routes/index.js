const projectController = require('../controllers/projectController');
const serverController = require('../controllers/serverController');

module.exports = function(app) {
    const project = new projectController();
    const server = new serverController();

    //This route have Query parameters
    app.get('/projects/add', function(req, res) {
        project.setProject(req, res);
    })

    app.get('/update', function(req, res) {
        server.updateServer();
    })

    app.get('/', function(req, res) {
        res.json({ API: 'UpdateServer ON' });
    })
}