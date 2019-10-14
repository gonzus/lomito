const { logger } = require('../log.js');
const { makeExecutableSchema } = require('graphql-tools');

const continentsQueries = require(`../models/continents.js`);
const countriesQueries = require(`../models/countries.js`);
const regionsQueries = require(`../models/regions.js`);
const citiesQueries = require(`../models/cities.js`);

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
        "list of regions in country"
        regions: [Region],
        "list of cities in country"
        cities: [City],
    },

    """Regions"""
    type Region {
        "region id, a unique integer"
        id: Int,
        "region name, a unique string"
        name: String,
        "the country to which this region belongs"
        country: Country,
        "list of cities in region"
        cities: [City],
    },

    """Cities"""
    type City {
        "city id, a unique integer"
        id: Int,
        "city name, a unique string"
        name: String,
        "city ISO2 code, a unique string"
        iso2: String,
        "city ISO3 code, a unique string"
        iso3: String,
        "city geographical latitude"
        lat: Float,
        "city geographical longitude"
        lon: Float,
        "city population"
        population: Int,
        "the region to which this city belongs"
        region: Region,
        "the country to which this city belongs"
        country: Country,
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

        "get a region given its id"
        region(id: Int!): Region,
        "get all regions"
        regions: [Region],

        "get a city given its id"
        city(id: Int!): City,
        "get all cities"
        cities: [City],
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

        region: async function(query, args) {
            logger.info("QUERY region", args);
            const promise = regionsQueries.getById(args.id);
            const [regions] = await Promise.all([promise]);
            logger.debug("got region", regions);
            return regions[0];
        },
        regions: async function(query) {
            logger.info("QUERY regions");
            const promise = regionsQueries.getAll();
            const [regions] = await Promise.all([promise]);
            logger.debug("got regions", regions);
            return regions;
        },

        city: async function(query, args) {
            logger.info("QUERY city", args);
            const promise = citiesQueries.getById(args.id);
            const [cities] = await Promise.all([promise]);
            logger.debug("got city", cities);
            return cities[0];
        },
        cities: async function(query) {
            logger.info("QUERY cities");
            const promise = citiesQueries.getAll();
            const [cities] = await Promise.all([promise]);
            logger.debug("got cities", cities);
            return cities;
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
        regions: async function(country) {
            logger.info("RESOLVE country regions", country);
            const country_id = country.id;
            const promise = regionsQueries.getByCountryId(country_id);
            const [regions] = await Promise.all([promise]);
            logger.debug("got regions", regions);
            return regions;
        },
        cities: async function(country) {
            logger.info("RESOLVE country cities", country);
            const country_id = country.id;
            const promise = citiesQueries.getByCountryId(country_id);
            const [cities] = await Promise.all([promise]);
            logger.debug("got cities", cities);
            return cities;
        },
    },

    Region: {
        country: async function(region) {
            logger.info("RESOLVE region country", region);
            const country_id = region.country_id;
            const promise = countriesQueries.getById(country_id);
            const [countries] = await Promise.all([promise]);
            logger.debug("got country", countries);
            return countries[0];
        },
        cities: async function(region) {
            logger.info("RESOLVE region cities", region);
            const region_id = region.id;
            const promise = citiesQueries.getByRegionId(region_id);
            const [cities] = await Promise.all([promise]);
            logger.debug("got cities", cities);
            return cities;
        },
    },

    City: {
        region: async function(city) {
            logger.info("RESOLVE city region", city);
            const region_id = city.region_id;
            const promise = regionsQueries.getById(region_id);
            const [regions] = await Promise.all([promise]);
            logger.debug("got region", regions);
            return regions[0];
        },
        country: async function(city) {
            logger.info("RESOLVE city country", city);
            const country_id = city.country_id;
            const promise = countriesQueries.getById(country_id);
            const [countries] = await Promise.all([promise]);
            logger.debug("got country", countries);
            return countries[0];
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs: types,
    resolvers,
});

module.exports = { schema };
