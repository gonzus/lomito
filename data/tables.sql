DROP TABLE IF EXISTS continents;
CREATE TABLE continents (
    id             int unsigned AUTO_INCREMENT        NOT NULL,
    name           varchar(100)                       NOT NULL,

    PRIMARY KEY                   (id),
    UNIQUE KEY  name              (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS countries;
CREATE TABLE countries (
    id             int unsigned AUTO_INCREMENT        NOT NULL,
    name           varchar(100)                       NOT NULL,
    continent_id   int unsigned                       NOT NULL,
    iso2           char(2)                            NOT NULL,
    iso3           char(3)                            NOT NULL,

    PRIMARY KEY                   (id),
    UNIQUE KEY  name_continent    (name, continent_id),
    UNIQUE KEY  iso2              (iso2),
    UNIQUE KEY  iso3              (iso3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS regions;
CREATE TABLE regions (
    id             int unsigned AUTO_INCREMENT        NOT NULL,
    name           varchar(100)                       NOT NULL,
    country_id     int unsigned                       NOT NULL,

    PRIMARY KEY                   (id),
    UNIQUE KEY  name_country      (name, country_id),
    KEY         country           (country_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS cities;
CREATE TABLE cities (
    id             int unsigned AUTO_INCREMENT        NOT NULL,
    name           varchar(100)                       NOT NULL,
    region_id      int unsigned                       NOT NULL,
    country_id     int unsigned                       NOT NULL,
    lat            double                             NOT NULL,
    lon            double                             NOT NULL,
    population     int unsigned                       NOT NULL,
    external_id    varchar(20)  CHARACTER SET ASCII       NULL,

    PRIMARY KEY                   (id),
    UNIQUE KEY  name_region       (name, region_id),
    KEY         name_country      (name, country_id),
    KEY         region            (region_id),
    KEY         country           (country_id),
    KEY         external          (external_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
