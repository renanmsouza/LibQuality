module.exports = function(app) {
    app.get('/', function(req, res) {
        res.json({ API: 'Backend REST' });
    })
}