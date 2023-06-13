
const http = require("http");
const App = require("./App");
const port = process.env.port || 7000;

const server = http.createServer(App);

App.listen(port)
