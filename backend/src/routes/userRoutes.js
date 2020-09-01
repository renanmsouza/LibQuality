const userController = require('../controllers/userController');

module.exports = function(app) {
    const users = new userController();

    app.get('/users', function(req, res){
        users.list(req, res);           
    });

    app.get('/users/get/:id', function(req, res){
        users.get(req, res);          
    });

    app.post('/users', function(req, res){
        users.post(req, res);           
    });

    app.put('/users', function(req, res){
        users.set(req, res);          
    });

    app.delete('/users/del/:id', function(req, res){
        users.del(req, res);           
    });

    // Authentication Login
    app.get('/users/auth', function(req, res){
        users.auth(req, res);          
    });
}