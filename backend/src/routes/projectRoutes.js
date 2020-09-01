const projectController = require('../controllers/projectController');

module.exports = function(app) {
    const projects = new projectController();

    app.get('/projects', function(req, res){
        projects.list(req, res);           
    });

    app.get('/projects/search', function(req, res){
        projects.search(req, res);           
    });

    app.post('/projects/add', function(req, res){
        projects.add(req, res);           
    });

    app.get('/projects/get/:id', function(req, res){
        projects.get(req, res);          
    });

    app.delete('/projects/del/:id', function(req, res){
        projects.del(req, res);           
    });
}