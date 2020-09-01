const server = require('./src/server');
const app = server();

app.listen(3000, () => {
    console.log('Server on: 3000');
});