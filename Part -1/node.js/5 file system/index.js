const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, 'data');

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
    console.log('Directory created successfully');
}

const filePath = path.join(dataFolder, 'data.txt')
fs.writeFileSync(filePath, 'Hello, Node.js!');

const readData = fs.readFileSync(filePath, 'utf-8')
console.log('Read data:', readData);

fs.appendFileSync(filePath, '\nThis is appended data.');

//async way to create a file

const asyncfilepath = path.join(dataFolder,'async_data.txt')

fs.writeFile(asyncfilepath, 'Hello, Async Node.js!', (err) => {if(err) throw err.message
    console.log('Async file created successfully');

    let asyncreadfile = fs.readFile(asyncfilepath, 'utf-8', (err, data) => { if (err) throw err.message;
        console.log('Async file read:', data);

        fs.appendFile(asyncfilepath, '\nThis is appended async data.', (err)=> {if(err) throw err.message
            console.log('Async file appended successfully');

            fs.readFile(asyncfilepath, 'utf-8', (err, data) => { if (err) throw err.message;
                console.log('Async file after appending:', data);   
            })
     })

})
})
    