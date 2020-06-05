// const { gql } = require('apollo-server-express');

// const {
//   makeExecutableSchema,
//   mergeSchemas,
// } = require('graphql-tools');

// const typeDefsHello = gql`
//   type Query {
//       "A simple type for getting started!"
//       hello: String,    
//   }
// `;

// // A map of functions which return data for the schema.
// const resolversHello = {
//   Query: {
//       hello: () => 'Hello World !!',
//   }
// };

// const schemaHello = makeExecutableSchema({
//   typeDefs: typeDefsHello,
//   resolvers: resolversHello
// });

// console.log(schemaHello)