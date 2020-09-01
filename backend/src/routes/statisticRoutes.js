const statisticsController = require('../controllers/statisticController');

module.exports = function(app) {
    const statistics = new statisticsController();

    app.get('/statistics/all', function(req, res){
        statistics.list(req, res);           
    });

    app.get('/statistics/project/:id', function(req, res){
        statistics.getProjectStatistics(req, res);           
    });

    app.get('/statistics/last/project/:id', function(req, res){
        statistics.getLastProjectStatistics(req, res);           
    });
}