/*
*Primary file for the API

*/

//Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

const config = require('./config');

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

    //Get the payload if there is any
    const decoder = new stringDecoder('utf-8');
    let stringBuffer = '';

    req.on('data', function(data){
        stringBuffer += decoder.write(data);
    });

    req.on('end', function(){
        stringBuffer += decoder.end();

        //choose a handler for our request
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined'? router[trimmedPath]:handlers.notFound;

        //construct data object to send to handler
        const data = {
            'Path' : trimmedPath,
            'QueryParameters' : queryStringObject,
            'HttpMethod' : httpMethod,
            'Headers' : headers,
            'Payload' : stringBuffer,
        };

        //Route request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            //status code default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //payload defaults to an empty object
            payload = typeof(payload) =='object' ? payload : {};

            //convert payload to string
            const payloadString = JSON.stringify(payload)

            //return response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
})

server.listen(config.port, function(){
    console.log("server started in "+config.envName);
    console.log("the server is now listening on port "+config.port+"....");
})

//Define handlers
const handlers = {};

//sample handler
handlers.sample = function(data, callback){
    //Callback an http statis code, payload object
    callback(406, {'name': 'am a sample handler'});
};

//not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

//Define a reuest router
const router = {
    'sample': handlers.sample
}
