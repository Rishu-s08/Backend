/* 🔹 What is the Module Wrapper in Node.js?

In Node.js, every file is treated as a separate module. Before your code runs, Node wraps it inside a function. This is called the Module Wrapper Function.
🧠 Why does it do this?

To provide module-level scope. Unlike global scope, variables you define in one file won’t leak into others. This makes your code safe and isolated.
✅ The actual wrapper looks like this:

(function (exports, require, module, __filename, __dirname) {
  // Your entire JS file code lives here
});

So when you write:

console.log(__dirname);

You're actually using one of the arguments injected by Node itself.
✨ What are the parameters?
Parameter	Description
exports	Shortcut to export things from module
require	Function to import other modules
module	Represents the current module
__filename	Absolute path of the current file
__dirname	Absolute path of the current folder */


console.log('node moduule wrapper demo in wrapper_explorer.js');

console.log('__dirname:', __dirname);

console.log('__filename:', __filename);

module.exports.greet = function(name)
{
  console.log(`Hello ${name}!`);
};