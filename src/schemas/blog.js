const { logger } = require('../log.js');
const { makeExecutableSchema } = require('graphql-tools');

const posts = [
  {
    title: 'First post',
    description: 'Content of the first post',
    author: 'Flavio',
  },
  {
    title: 'Second post',
    description: 'Content of the second post',
    author: 'Roger',
  },
]

const authors = {
  'Flavio': {
    name: 'Flavio',
    age: 36,
  },
  'Roger': {
    name: 'Roger',
    age: 7,
  },
}

const types = `
    type Author {
        name: String,
        age: Int,
    },
    type Post {
        title: String,
        description: String,
        author: Author,
    },
    type Query {
        post(id: Int!): Post,
        posts: [Post],
        authors: [Author],
    },
`;

const resolvers = {
    Query: {
        post: function(query, args) {
            logger.info("QUERY post", query, args);
            const id = args.id;
            return posts[id];
        },
        posts: function(query) {
            logger.info("QUERY posts");
            return posts;
        },
        authors: function(query) {
            logger.info("QUERY authors");
            return Object.values(authors);
        },
    },
    Post: {
        author(post) {
            logger.info("RESOLVE post author", post);
            const author = post.author;
            return authors[author];
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs: types,
    resolvers,
});

module.exports = { schema };
