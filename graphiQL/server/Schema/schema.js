const graphql = require('graphql');
const _ = require('lodash')
const Book = require('../models/book');
const Author = require('../models/author');

const {GraphQLObjectType, 
       GraphQLString, 
       GraphQLSchema,
       GraphQLID,
       GraphQLInt,
       GraphQLList,
       GraphQLNonNull
      } = graphql;

// // dummy data 
//  var books = [ 
//      {name: 'the last mohican',genre:'Fantasy',id:'1', authorId: '1'},
//      {name: 'the last jedi',genre:'Fantasy',id:'2',authorId: '2' },
//      {name: 'the running man', genre: 'Fantasy',id:'3', authorId: '3'},
//      {name: 'the runner ', genre: 'Fantasy',id:'3', authorId: '3'},

//  ];

// var authors = [
//     {name: 'Patrick Rothfuss', age: 44, id: '1'},
//     {name: 'Brandon Sanderson', age: 42, id: '2'},
//     {name: 'Terry Pratchett',age: 66, id:'3'}
// ];

// var cars = [
//     {id: '1', make: 44, model: '1' ,year: 2019},
//     {name: 'Brandon Sanderson', age: 42, id: '2'},
//     {name: 'Terry Pratchett',age: 66, id:'3'}
// ];

const BookType = new GraphQLObjectType({
    name:'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre: { type: new GraphQLNonNull(GraphQLString)},
        author: { 
            type: AuthorType,
            resolve(parent,args){
                console.log(parent)
                // Local Array Query 
                // return _.find(authors,{id: parent.authorId})
                return Author.findById(parent.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
        fields: () => ({
            id: {type: GraphQLID},
            name: { type: new GraphQLNonNull(GraphQLString)}, 
            age: {type: new GraphQLNonNull(GraphQLInt)},
            books: {
                type: new GraphQLList(BookType),
                resolve(parent,args){
                    // Local Array Filter Query
                    // return _.filter(books,{authorId: parent.id})
                    return Book.find({authorId: parent.id})
                }
            }
        })
});

const CarType = new GraphQLObjectType({
    name: 'Car',
    fields: () =>({
        id: {type: GraphQLID},
        make: {type: GraphQLString},
        model: {type: GraphQLString},
        year: {type: GraphQLInt}
    })
})

const RootQuery  = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLString }},
            resolve(parent,args){
                // Get data from database/other source
                console.log(typeof(args.id));
                // return _.find(books, {id:args.id});
                return Book.findById(args.id);
            }
        },
    author:{
        type: AuthorType,
        args: { id: { type: GraphQLID }},
        resolve(parent,args){
            // Get Author From DataSource  
            // return _.find(authors, {id:args.id});
            return Author.findById(args.id);
        }
    },
    cars:{
        type: CarType,
        args: {id: {type: GraphQLID }},
        resolve(parent,args){
            // Get Cars from Datasource
            return _.find(cars, {id:args.id});
        }
    },
    books: {
        type: new GraphQLList(BookType),
        resolve(parent,args){
            // return books
            return Book.find({});
        }
    },
    authors:{
        type: new GraphQLList(AuthorType),
        resolve(parent,args){
            // return authors
            return Author.find({});
        }
    }
} 
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent,args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
               return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name:{type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent,args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId

                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})