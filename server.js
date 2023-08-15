const http = require('http')
const app = require('./app');
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
    console.log(`Application running http://localhost:${process.env.PORT}`);
});
