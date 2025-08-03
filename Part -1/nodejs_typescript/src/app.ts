import express, {Express, NextFunction, Request, Response} from 'express';

const app : Express= express()
const PORT : number = 3000;

app.use(express.json())

interface CustomRequest extends Request{
    startTime? : number
}

app.use((req : CustomRequest, res : Response, next : NextFunction)=>{
    req.startTime = Date.now();
    next();

});

app.get('/user', (req : Request, res : Response)=>{
    res.send("hello user")
})

interface User {
    name : string,
    email : string
}


app.post('/useradd', (req: Request<{}, {}, User>, res : Response)=>{
    const {name, email} = req.body;
    res.send("user added")
})

app.get('user/:id', (req: Request<{id : string}>, res: Response)=>{
    const {id} = req.params;
    res.json({
        userId : id
    })
})

app.listen(PORT, ()=>{
    console.log("server is running on port 3000");
    
})

