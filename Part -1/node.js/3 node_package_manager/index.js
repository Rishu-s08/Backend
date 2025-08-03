const lodash = require('lodash');

const name = ['ohn', 'ane', 'lice', 'ob', 'harlie'];

const capitalizedNames = lodash.map(name, lodash.capitalize)
console.log(capitalizedNames);
