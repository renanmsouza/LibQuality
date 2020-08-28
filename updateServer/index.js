const server = require('./src/server');
const app = server();

app.listen(3001, () => {
    console.log('Server on: 3001');
});