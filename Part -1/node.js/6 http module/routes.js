const http = require('http')

const server = http.createServer((req, res)=>{
    if(req.url === '/'){
        res.writeHead(200, {'Content-Type':'text/plain'})
        res.end("from ///////////")
    }else if(req.url === '/home'){
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end("from /homeeeeeeeeeeee")
    }
})

server.listen(3000, ()=>{
    console.log("server running");
    
})