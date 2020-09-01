const server = require('./src/server');
const app = server();

app.listen(3001, () => {
    console.log('Server on: 3001');

    var inerval = 1000 * 60 * 10;
    setInterval( function() {
        console.log('Opa2!!')
    }, inerval);
});