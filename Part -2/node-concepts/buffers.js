// object -> handle binary data
// file system operations, cryptography, image processing

/* ChatGPT said:
🧠 What Are Buffers in Node.js?

Buffers in Node.js are a way to handle binary data directly in memory — especially useful when dealing with files, network streams, or binary protocols.
💡 Why Buffers?

JavaScript normally handles strings and not raw binary data. But for things like:

    Reading a file (fs.readFile)

    Receiving a TCP packet (net)

    Handling a file upload

    Dealing with streams

…you need to work with raw bytes. That’s where Buffer comes in.
🔍 Think of a Buffer as:

    A fixed-size chunk of memory, similar to an array, but stores raw binary data (not numbers or strings).*/


const buffOne = Buffer.alloc(10);
console.log(buffOne);

const bufffromstring = Buffer.from('Hello');
console.log(bufffromstring);

const buffFromArrayOfInt = Buffer.from([1,2,3,4,5]);
console.log(buffFromArrayOfInt);

buffOne.write('Node js')
console.log('after writing in buffer one',buffOne.toString());

console.log(bufffromstring[0]);

console.log(bufffromstring.slice(0,2));

console.log(Buffer.concat([bufffromstring, buffOne]));
