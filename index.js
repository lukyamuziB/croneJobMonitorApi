/*
*Primary file for the API

*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

const config = require('./lib/config');


//Intatiate http server
const httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

const httpsServerOPtions = {
    'key' : fs.readFileSync('./https/key.pem', 'utf-8'),
    'cert' : fs.readFileSync('./https/cert.pem', 'utf-8'),
};

//Instatiate https Server
const httpsServer = https.createServer(httpsServerOPtions,function(req,res){
    unifiedServer(req,res);
})

httpServer.listen(config.httpPort, function(){
    console.log("Http server started in "+config.envName);
    console.log("Http server is now listening on port "+config.httpPort+"....");
})

httpsServer.listen(config.httpsPort, function(){
    console.log("Https server started in "+config.envName);
    console.log("Https server is now listening on port "+config.httpsPort+"....");
})

//combined server logic
const unifiedServer = function(req,res){
    //get the URL and parse it
    const parseUrl = url.parse(req.url, true);

    //get the path
    const path = parseUrl.pathname; 
    const trimmedPath = path.replace(/^\/+|\+$/g, '');

    //Get the query string as an object
    const queryStringObject = parseUrl.query;

    //get the http method
    const httpMethod = req.method.toLowerCase();

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
            'payload' : helpers.parseJsonToObject(stringBuffer),
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
};

//Define a reuest router
const router = {
    'ping': handlers.ping,
    'users': handlers.users,
}
