const EventEmitter = require('events')


const emitter = new EventEmitter()


emitter.on('greet', ()=> console.log("hiiiiiii"))

emitter.emit('greet')