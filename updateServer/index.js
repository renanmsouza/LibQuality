const server = require('./src/server');
const app = server();

const serverController = require('./src/controllers/serverController');

app.listen(3001, () => {
    console.log('Server on: 3001');

    const server = new serverController();

    var inerval = 1000 * 60 * 5;
    setInterval( function() {
        server.updateServer(app.res);
    }, inerval);
});