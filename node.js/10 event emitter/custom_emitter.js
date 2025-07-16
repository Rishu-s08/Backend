const EventEmitter = require('events')

class CustomEmitter extends EventEmitter{
    constructor(){
        super();
        this.greeting = "helloooo"
    }

    greet(name){
        this.emit("greeting", this.greeting,` ${name}`)
    }

}

const myCustomEmitter = new CustomEmitter();
myCustomEmitter.on('greeting', (value, v)=>console.log('Greeting event', value, v))

myCustomEmitter.greet('greeting')