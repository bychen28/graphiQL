var express = require('express');
var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');
const schema = require('./Schema/schema')
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();

//allow cross-origin requests
app.use(cors());


// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var root = { hello: () => 'Hello world!' };

// connect to mlab DB
mongoose.connect('mongodb://admin:adminpw1@ds253804.mlab.com:53804/gql-ninja')
mongoose.connection.once('open',() => {
    console.log('DB Connection Established')
})


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));


app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));