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


    //send the response
    res.end('Hello there\n')

    //log path
    console.log('Request was recieved on: '+trimmedPath);

})

server.listen(3000, function(){
    console.log("the serer is now listening....");
})
