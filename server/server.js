const server = require('server');

const {get, post} = server.router;

// launcher server
server({ port: 8080 }, [
    get('/', ctx => 'Hello world!')
]);
