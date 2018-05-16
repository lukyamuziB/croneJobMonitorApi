/*
*Primary file for the API

*/

//Dependencies
const http = require('http');
//the server shoild respond to all requests with a string and listen on port 3000

const server = http.createServer(function(req,res){
    res.end('Hello there\n');
})

server.listen(3000, function(){
    console.log("the serer is now listening....");
})
