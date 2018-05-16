/*
*Primary file for the API

*/

//Dependencies
const http = require('http');
const url = require('url');

//the server shoild respond to all requests with a string and listen on port 3000

const server = http.createServer(function(req,res){
    //get the URL and parse it
    const parseUrl = url.parse(req.url, true);

    //get the path
    const path = parseUrl.pathname; 
    const trimmedPath = path.replace(/^\/+|\+$/g, '');

    //Get the query string as an object
    const queryStringObject = parseUrl.query;

    //get the http method
    const httpMethod = req.method.toLocaleLowerCase();

    //Get the headers as an object
    const headers = req.headers;
    
    //send the response
    res.end('Hello there\n')

    //log path
    console.log('Request was recieved on: '+trimmedPath+ ' with '+httpMethod+  ' method'+ ' and query params\n',queryStringObject);
    console.log('\n Request recieved with these headers: ', headers);
})

server.listen(3000, function(){
    console.log("the server is now listening....");
})
