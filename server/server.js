const server = require('server');
const {get, post} = server.router;

let sketch_state = "BADDATA";

let rooms = [];
let tutors = [];
let roomID = 0;

server({ port: 8080 }, [
  get('/', ctx => sketch_state),
  post('/', ctx => {
    console.log(ctx.data);
    sketch_state = ctx.data;
    return 'ok';
  })
]);
console.log("Server started on localhost:8080")

