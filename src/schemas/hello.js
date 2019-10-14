const { makeExecutableSchema } = require('graphql-tools');

const types = `
    type Query {
        hello: String,
    }
`;

const resolvers = {
    Query: {
        hello: function(query) {
            return "Hello dear gonzus!";
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs: types,
    resolvers,
});

module.exports = { schema };
