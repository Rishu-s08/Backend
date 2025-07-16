const fs = require("fs")
const path = require("path")
function person(name, callbackFn){
    console.log(`hello ${name}`);
    callbackFn()
}

function address(){
    console.log("india");
    
}
person('rishi', address)

let filepath = path.join(__dirname, "input.txt")
fs.readFile(filepath,'utf8', (err, data)=>{
    if(err){
        console.log("Error", err);
    return;    
    }
console.log(data);

})