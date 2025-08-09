/* 

🧠 What are Microtasks and Macrotasks in JavaScript?

JavaScript uses an event loop to handle asynchronous operations. This loop has two main types of task queues:
1. 🐜 Microtasks (Higher Priority)

These are small, fast tasks that are processed immediately after the current execution, before the event loop continues to the next cycle.

✅ Examples:

    Promise.then() / catch() / finally()

    queueMicrotask()

    MutationObserver

⏳ Run:
After current code finishes, before setTimeout and other macrotasks.
2. 🐘 Macrotasks (Lower Priority)

These are tasks that go into the macrotask queue, which the event loop processes after microtasks are done.

✅ Examples:

    setTimeout()

    setInterval()

    setImmediate() (Node.js only)

    I/O events (like file reads in Node)

    DOM events (like clicks)

⏳ Run:
After microtasks and on the next tick of the event loop.


*/

// timers -> pending callbacks -> idle, prepare -> poll -> check -> close callbacks
/*

💡 Phase-by-Phase Breakdown
1. timers

    Handles setTimeout() and setInterval()

    Only executes if the scheduled time has been reached

2. pending callbacks

    Handles system-level callbacks (e.g., errors from TCP)

    Rarely used directly by developers

3. idle, prepare

    Internal use only (you can ignore this for now)

4. poll

    This is the heart of the loop:

        Waits for incoming I/O events (file reads, sockets, etc.)

        Executes those callbacks

5. check

    Executes setImmediate() callbacks

    Comes after the poll phase

6. close callbacks

    Executes things like:

socket.on('close', () => {...}); */

const fs = require('fs');
const crypto = require('crypto');

console.log("script start");


setTimeout(()=>{
    console.log("2. set timeout 0s (macrotask)");
    
}, 0)

setTimeout(() => {
    console.log("3. set timeout 0s (macrotask)");

}, 0)

setImmediate(()=>{
    console.log('4. set immediate callback (check) ');
    
})

Promise.resolve().then(()=>{
    console.log('5. Promise resolved (microtask)')
})

process.nextTick(()=>{
    console.log("6. process.nexttick callback (microtask)");
    
})

fs.readFile(__filename, ()=>{
    console.log('7. file read operation (I/O callback)');
    
})


crypto.pbkdf2('password', 'salt', 10000, 64, 'sha512', (err, key)=>{
    console.log('8. crypto operation (CPU intensive task) ', key);
    })


console.log("9. script end");
