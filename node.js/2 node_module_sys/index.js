const firstModule = require('./firstmodule')

console.log(firstModule.add(5, 3)); 
console.log(firstModule.sub(5, 3));    
console.log(firstModule.mul(5, 3));

try {
    console.log(firstModule.div(5, 0));
} catch (error) {
    console.log(error.message);
} 

