const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const fs = require('fs');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const bodyParser = require("body-parser");

const port = 8080;

server.use(middlewares);

server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

const dbFile = fs.readFileSync("backend/db.json", "utf8");
const dbJson = JSON.parse(dbFile);

let responseDataStructure = {
    "jsonrpc": "2.0",
    "id": 111111,
    "result": {}
};

let reportResultStructure = {
    "metadata": {},
    "data": []
};

server.post('/:method.calls', (req, res) => {
    // console.log(req.params['method'])
    // console.log(req.params)
    // console.log(req.body)

    let responseData = {};
    if (req.params['method'] === 'get') {
        Object.assign(responseData, responseDataStructure, {result: Object.assign({}, reportResultStructure, dbJson['calls'])});
    }

    return res.jsonp(responseData)
});

server.post('/:method.clients', (req, res) => {
    let responseData = {};
    if (req.params['method'] === 'get') {
        Object.assign(responseData, responseDataStructure, {result: Object.assign({}, reportResultStructure, dbJson['clients'])});
    }
    return res.jsonp(responseData)
});




server.use(router);
server.listen(port, () => {
    console.log(`JSON Server is running! \r\n Home: \r\n http://localhost:${port}`)
});
