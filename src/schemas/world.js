const { logger } = require('../log.js');
const { makeExecutableSchema } = require('graphql-tools');

const continentsQueries = require(`../models/continents.js`);
const countriesQueries = require(`../models/countries.js`);

const types = `
    """Continents"""
    type Continent {
        "continent id, a unique integer"
        id: Int,
        "continent name, a unique string"
        name: String,
        "list of countries in continent"
        countries: [Country],
    },

    """Countries"""
    type Country {
        "country id, a unique integer"
        id: Int,
        "country name, a unique string"
        name: String,
        "country ISO2 code, a unique string"
        iso2: String,
        "country ISO3 code, a unique string"
        iso3: String,
        "the continent to which this country belongs"
        continent: Continent,
    },

    """Queries"""
    type Query {
        "get a continent given its id"
        continent(id: Int!): Continent,
        "get all continents"
        continents: [Continent],

        "get a country given its id"
        country(id: Int!): Country,
        "get all countries"
        countries: [Country],
    },
`;

const resolvers = {
    Query: {
        continent: async function(query, args) {
            logger.info("QUERY continent", args);
            const promise = continentsQueries.getById(args.id);
            const [continents] = await Promise.all([promise]);
            logger.debug("got continent", continents);
            return continents[0];
        },
        continents: async function(query) {
            logger.info("QUERY continents");
            const promise = continentsQueries.getAll();
            const [continents] = await Promise.all([promise]);
            logger.debug("got continents", continents);
            return continents;
        },

        country: async function(query, args) {
            logger.info("QUERY country", args);
            const promise = countriesQueries.getById(args.id);
            const [countries] = await Promise.all([promise]);
            logger.debug("got country", countries);
            return countries[0];
        },
        countries: async function(query) {
            logger.info("QUERY countries");
            const promise = countriesQueries.getAll();
            const [countries] = await Promise.all([promise]);
            logger.debug("got countries", countries);
            return countries;
        },
    },

    Continent: {
        countries: async function(continent) {
            logger.info("RESOLVE continent countries", continent);
            const continent_id = continent.id;
            const promise = countriesQueries.getByContinentId(continent_id);
            const [countries] = await Promise.all([promise]);
            logger.debug("got countries", countries);
            return countries;
        },
    },

    Country: {
        continent: async function(country) {
            logger.info("RESOLVE country continent", country);
            const continent_id = country.continent_id;
            const promise = continentsQueries.getById(continent_id);
            const [continents] = await Promise.all([promise]);
            logger.debug("got continent", continents);
            return continents[0];
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs: types,
    resolvers,
});

module.exports = { schema };
