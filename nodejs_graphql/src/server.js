require('dotenv').config()
const {ApolloServer} = require('@apollo/server')
const {startStandaloneServer} = require('@apollo/server/standalone')
const typeDefs = require('./graphql/schema')
const connectToDb = require('./database/db')
const resolvers = require('./graphql/resolvers')


connectToDb();

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    })

    const {url} = await startStandaloneServer(server, {
        listen:{port:process.env.PORT}
    })

    console.log(`Server is ready at ${url}`);

}

startServer();

