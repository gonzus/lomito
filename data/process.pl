# Process csv data file from this URL (free version):
#
#     https://simplemaps.com/data/world-cities
#
# and generate INSERT statements for a MySQL database.
#
# Script complements the data with information about continents and normalizes
# some of the city and country names.
use strict;
use warnings;
use utf8;

use Text::CSV_XS qw( csv );
use Data::Dumper;

my %countries_by_name;
my %regions_by_name;
my %cities_by_name;
my @countries;
my @regions;
my @cities;

my %continents = (
    1 => 'Europe'    ,
    2 => 'Asia'      ,
    3 => 'America'   ,
    4 => 'Africa'    ,
    5 => 'Oceania'   ,
    6 => 'Antarctica',
);

my %translation = (
    "Bosnia And Herzegovina"                          => "Bosnia and Herzegovina",
    "Macedonia"                                       => "North Macedonia",
    "Burma"                                           => "Myanmar",
    "Korea, North"                                    => "North Korea",
    "Korea, South"                                    => "South Korea",
    "Bahamas, The"                                    => "Bahamas",
    "United States"                                   => "United States of America",
    "Saint Pierre And Miquelon"                       => "Saint Pierre and Miquelon",
    "Turks And Caicos Islands"                        => "Turks and Caicos Islands",
    "Trinidad And Tobago"                             => "Trinidad and Tobago",
    "Virgin Islands, British"                         => "Virgin Islands",
    "Antigua And Barbuda"                             => "Antigua and Barbuda",
    "Saint Vincent And The Grenadines"                => "Saint Vincent and the Grenadines",
    "Falkland Islands (Islas Malvinas)"               => "Falkland Islands",
    "South Georgia And South Sandwich Islands"        => "South Georgia and South Sandwich Islands",
    "Saint Kitts And Nevis"                           => "Saint Kitts and Nevis",
    "Congo, Democratic Republic of the"               => "Democratic Republic of the Congo",
    "Congo (Kinshasa)"                                => "Democratic Republic of the Congo",
    "Congo, Republic of the"                          => "Republic of the Congo",
    "Congo (Brazzaville)"                             => "Republic of the Congo",
    "Swaziland"                                       => "Eswatini",
    "Gambia, The"                                     => "The Gambia",
    "Saint Helena, Ascension, And Tristan Da Cunha"   => "Saint Helena, Ascension, and Tristan da Cunha",
    "Sao Tome And Principe"                           => "São Tomé and Príncipe",
    "Micronesia, Federated States Of"                 => "Federated States of Micronesia",
    "Wallis And Futuna"                               => "Wallis and Futuna",
    "Côte D’Ivoire"                                   => "Côte d’Ivoire",
    "Isle Of Man"                                     => "Isle of Man",
);

my %countries_per_continent = (
    ( map { $_ => 1 } (
        "Albania",
        "Andorra",
        "Armenia",
        "Austria",
        "Azerbaijan",
        "Belarus",
        "Belgium",
        "Bosnia and Herzegovina",
        "Bulgaria",
        "Croatia",
        "Cyprus",
        "Czechia",
        "Denmark",
        "Estonia",
        "Finland",
        "France",
        "Georgia",
        "Germany",
        "Greece",
        "Hungary",
        "Iceland",
        "Ireland",
        "Italy",
        "Kazakhstan",
        "Kosovo",
        "Latvia",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Malta",
        "Moldova",
        "Monaco",
        "Montenegro",
        "Netherlands",
        "North Macedonia",
        "Norway",
        "Poland",
        "Portugal",
        "Romania",
        "Russia",
        "San Marino",
        "Serbia",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Sweden",
        "Switzerland",
        "Turkey",
        "Ukraine",
        "United Kingdom",
        "Vatican City",
        "Svalbard",
        "Faroe Islands",
        "Guernsey",
        "Gibraltar",
        "Greenland",
        "Isle of Man",
        "Jersey",
    )),
    ( map { $_ => 2 } (
        "Afghanistan",
        "Armenia",
        "Azerbaijan",
        "Bahrain",
        "Bangladesh",
        "Bhutan",
        "Brunei",
        "Cambodia",
        "China",
        "Cyprus",
        "Georgia",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Israel",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Lebanon",
        "Malaysia",
        "Maldives",
        "Mongolia",
        "Myanmar",
        "Nepal",
        "North Korea",
        "Oman",
        "Pakistan",
        "Palestine",
        "Philippines",
        "Qatar",
        "Russia",
        "Saudi Arabia",
        "Singapore",
        "South Korea",
        "Sri Lanka",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Thailand",
        "Timor-Leste",
        "Turkey",
        "Turkmenistan",
        "United Arab Emirates",
        "Uzbekistan",
        "Vietnam",
        "Yemen",
        "West Bank",
        "Mayotte",
        "Macau",
        "Reunion",
        "Cook Islands",
        "Christmas Island",
        "Hong Kong",
    )),
    ( map { $_ => 3 } (
        "Antigua and Barbuda",
        "Bahamas",
        "Barbados",
        "Belize",
        "Canada",
        "Costa Rica",
        "Cuba",
        "Dominica",
        "Dominican Republic",
        "El Salvador",
        "Grenada",
        "Guatemala",
        "Haiti",
        "Honduras",
        "Jamaica",
        "Mexico",
        "Nicaragua",
        "Panama",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent and the Grenadines",
        "Trinidad and Tobago",
        "United States of America",
        "Argentina",
        "Bolivia",
        "Brazil",
        "Chile",
        "Colombia",
        "Ecuador",
        "Guyana",
        "Paraguay",
        "Peru",
        "Suriname",
        "Uruguay",
        "Venezuela",
        "Saint Martin",
        "Martinique",
        "Montserrat",
        "Saint Pierre and Miquelon",
        "Sint Maarten",
        "Turks and Caicos Islands",
        "Virgin Islands",
        "Anguilla",
        "Aruba",
        "Saint Barthelemy",
        "Bermuda",
        "Curaçao",
        "Falkland Islands",
        "French Guiana",
        "Guadeloupe",
        "South Georgia and South Sandwich Islands",
        "Cayman Islands",
    )),
    ( map { $_ => 4 } (
        "Algeria",
        "Angola",
        "Benin",
        "Botswana",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Comoros",
        "Democratic Republic of the Congo",
        "Republic of the Congo",
        "Côte d’Ivoire",
        "Djibouti",
        "Egypt",
        "Equatorial Guinea",
        "Eritrea",
        "Eswatini",
        "Ethiopia",
        "Gabon",
        "The Gambia",
        "Ghana",
        "Guinea",
        "Guinea-Bissau",
        "Kenya",
        "Lesotho",
        "Liberia",
        "Libya",
        "Madagascar",
        "Malawi",
        "Mali",
        "Mauritania",
        "Mauritius",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Niger",
        "Nigeria",
        "Rwanda",
        "São Tomé and Príncipe",
        "Senegal",
        "Seychelles",
        "Sierra Leone",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Sudan",
        "Tanzania",
        "Togo",
        "Tunisia",
        "Uganda",
        "Zambia",
        "Zimbabwe",
        "Saint Helena, Ascension, and Tristan da Cunha",
    )),
    ( map { $_ => 5 } (
        "Australia",
        "Fiji",
        "Kiribati",
        "Marshall Islands",
        "Federated States of Micronesia",
        "Nauru",
        "New Zealand",
        "Palau",
        "Papua New Guinea",
        "Samoa",
        "American Samoa",
        "Solomon Islands",
        "Tonga",
        "Tuvalu",
        "Vanuatu",
        "New Caledonia",
        "Norfolk Island",
        "Niue",
        "French Polynesia",
        "Pitcairn Islands",
        "Wallis and Futuna",
        "Guam",
        "Northern Mariana Islands",
    )),
    ( map { $_ => 6 } (
    )),
);

my %cities_with_duplicates = (
    "Basse-Terre"  => {
        country    => "Guadeloupe",
        region     => "OTHER",
        that_name  => "Basse-terre",
    },
    "Şuḩār" => {
        country    => "Oman",
        region     => "Shamāl al Bāţinah",
        that_name  => "Suhar",
    },
    "Īlām" => {
        country    => "Iran",
        region     => "Īlām",
        that_name  => "Ilam",
    },
    "Sārī" => {
        country    => "Iran",
        region     => "Māzandarān",
        that_name  => "Sari",
    },
);

my %region_names = (
    "Chile" => {
        "Chillán" => "Ñuble",
    },
    "Belarus" => {
        "Minsk" => "Minsk Voblasć",
    },
    "United Kingdom" => {
        "London" => "Greater London",
    },
    "Norway" => {
        "Trondheim" => "Trøndelag",
        "Rørvik" => "Vikna",
        "Namsos" => "Trøndelag",
        "Steinkjer" => "Trøndelag",
    },
);

exit main();

sub main {
    foreach my $arg (@ARGV) {
        process_csv($arg);
    }
    return 0;
}

sub process_csv() {
    # "city","city_ascii","lat","lng","country","iso2","iso3","admin_name","capital","population","id"
    my ($name) = @_;

    my $data = csv(in => $name,
                   headers => "auto");
    printf STDERR ("File [%s]: read %d records\n", $name, scalar @$data);

    %countries_by_name = ();
    %regions_by_name = ();
    %cities_by_name = ();
    @countries = ();
    @regions = ();
    @cities = ();

    my %duplicates_seen;
    my %countries_seen;
    foreach my $line (@$data) {
        my $country_name = $line->{country};
        my $region_name = $line->{admin_name} || 'OTHER';
        my $city_name = $line->{city};
        next unless $country_name && $region_name && $city_name;

        if ($region_name eq 'OTHER' && exists $region_names{$country_name}{$city_name}) {
            $region_name = $region_names{$country_name}{$city_name};
            printf STDERR ("Using region name [%s] for [%s] [%s]\n", $region_name, $country_name, $city_name);
        }

        $country_name = $translation{$country_name} if exists $translation{$country_name};
        ++$countries_seen{$country_name};

        if (!exists $countries_per_continent{$country_name} && !$duplicates_seen{$country_name}) {
            printf STDERR ("Don't know continent for country [%s]\n", $country_name);
            ++$duplicates_seen{$country_name};
            next;
        }

        my $full_country_name = $country_name;
        my $country_id;
        my $country;
        if (exists $countries_by_name{$full_country_name}) {
            $country_id = $countries_by_name{$full_country_name};
            $country = $countries[$country_id];
        } else {
            $country_id = @countries;
            $country = {
                id => $country_id,
                name => $country_name,
                continent_id => $countries_per_continent{$country_name},
                iso2 => $line->{iso2},
                iso3 => $line->{iso3},
                regions => [],
                cities => [],
            };
            push @countries, $country;
            $countries_by_name{$country_name} = $country_id;
        }

        my $full_region_name = join('|', $country_name, $region_name);
        my $region_id;
        my $region;
        if (exists $regions_by_name{$full_region_name}) {
            $region_id = $regions_by_name{$full_region_name};
            $region = $regions[$region_id];
        } else {
            $region_id = @regions;
            $region = {
                id => $region_id,
                name => $region_name,
                country_id => $country_id,
                cities => [],
            };
            push @regions, $region;
            $regions_by_name{$full_region_name} = $region_id;
            push @{ $country->{regions} }, $region_id;
        }

        my $full_city_name = join('|', $country_name, $region_name, $city_name);
        if (exists $cities_with_duplicates{$city_name}) {
            printf STDERR ("Found case of duplicate city [%s] [%s]\n", $city_name, $full_city_name);
        }
        my $city_id;
        my $city;
        my $new_city = {
            name => $city_name,
            region_id => $region_id,
            country_id => $country_id,
            lat => $line->{lat},
            lon => $line->{lng},
            population => $line->{population} || 0,
            external_id => $line->{id},
        };
        if (exists $cities_by_name{$full_city_name}) {
            $city_id = $cities_by_name{$full_city_name};
            $city = $cities[$city_id];
            if ($city->{population} <= 0) {
                # city we had already stored had a zero population...
                if ($new_city->{population} > 0) {
                    # current city has a non-zero population, use it
                    $city = $cities[$city_id] = $new_city;
                    $city->{id} = $city_id;
                } else {
                    printf STDERR ("Both cities have a zero population: [%s] [%s] [%s]\n",
                                   $full_country_name, $full_region_name, $full_city_name);
                    printf STDERR ("%s\n%s\n", Dumper($city), Dumper($line));
                }
            }
        } else {
            $city_id = @cities;
            $new_city->{id} = $city_id;
            $city = $new_city;
            push @cities, $city;
            $cities_by_name{$full_city_name} = $city_id;
            push @{ $region->{cities} }, $city_id;
            push @{ $country->{cities} }, $city_id;
        }
    }

    foreach my $country (keys %countries_per_continent) {
        next if exists $countries_seen{$country};
        printf STDERR ("Did not use country [%s]\n", $country);
    }

    foreach my $this_name (sort keys %cities_with_duplicates) {
        my $data = $cities_with_duplicates{$this_name};
        my $country = $data->{country};
        my $region = $data->{region};
        my $that_name = $data->{that_name};
        my $this_key = join('|', $country, $region, $this_name);
        my $that_key = join('|', $country, $region, $that_name);
        my $this = $cities[$cities_by_name{$this_key}];
        my $that = $cities[$cities_by_name{$that_key}];
        if ($this->{region_id} != $that->{region_id}) {
            printf STDERR ("Duplicate city [%s] [%s] - regions don't match\n",
                           $this_name, $that_name);
        } elsif ($this->{country_id} != $that->{country_id}) {
            printf STDERR ("Duplicate city [%s] [%s] - countries don't match\n",
                           $this_name, $that_name);
        } elsif ($this->{population} >  0 && $that->{population} >  0) {
            printf STDERR ("Duplicate city [%s] [%s] - both populations are positive\n",
                           $this_name, $that_name);
        } elsif ($this->{population} <= 0 && $that->{population} >  0) {
            printf STDERR ("Duplicate city [%s] [%s] - keeping that with name [%s]\n",
                           $this_name, $that_name, $this_name);
            $that->{name} = $this->{name};
            $this->{deleted} = 1;
        } elsif ($this->{population} >  0 && $that->{population} <= 0) {
            printf STDERR ("Duplicate city [%s] [%s] - keeping this with name [%s]\n",
                           $this_name, $that_name, $this_name);
            $that->{deleted} = 1;
        } else {
            printf STDERR ("Duplicate city [%s] [%s] - no population is positive\n",
                           $this_name, $that_name);
        }
    }

    printf STDERR ("There are %d countries\n", scalar @countries);
    # printf STDERR ("Countries: %s", Dumper(\@countries));
    printf STDERR ("There are %d regions\n", scalar @regions);
    # printf STDERR ("Regions: %s", Dumper(\@regions));
    printf STDERR ("There are %d cities\n", scalar @cities);
    # printf STDERR ("Cities: %s", Dumper(\@cities));

    # my @display_countries = qw/ Chile Switzerland Netherlands Latvia /;
    # my @display_countries = ('United States');
    # my @display_countries = qw/ Switzerland /;
    # my @display_countries = qw/ Chile /;
    # foreach my $country (@display_countries) {
    #     show_country($countries_by_name{$country});
    # }

    # my @others;
    # foreach my $region (@regions) {
    #     next unless $region->{name} eq 'OTHER';
    #     push @others, $region;
    # }
    # foreach my $other (sort { $countries[$a->{country_id}]->{name} cmp $countries[$b->{country_id}]->{name} } @others) {
    #     printf STDERR ("OTHER with %4d cities in [%s]\n", scalar @{ $other->{cities} }, $countries[$other->{country_id}]->{name});
    # }

    my $pos = 0;

    printf("-- continents\n");
    printf("begin;\n");
    $pos = 0;
    foreach my $id (sort keys %continents) {
        ++$pos;
        printf("INSERT INTO continents (id, name) VALUES (%d, \"%s\");\n",
               $id, $continents{$id});
    }
    printf("commit;\n");
    printf("-- %d continents\n", $pos);
    printf("\n");

    printf("-- countries\n");
    printf("begin;\n");
    $pos = 0;
    foreach my $country (@countries) {
        ++$pos;
        printf("INSERT INTO countries (id, name, continent_id, iso2, iso3) VALUES (%d, \"%s\", %d, \"%s\", \"%s\");\n",
               $country->{id} + 1, $country->{name}, $country->{continent_id}, $country->{iso2}, $country->{iso3});
    }
    printf("commit;\n");
    printf("-- %d countries\n", $pos);
    printf("\n");

    printf("-- regions\n");
    printf("begin;\n");
    $pos = 0;
    foreach my $region (@regions) {
        ++$pos;
        printf("INSERT INTO regions (id, name, country_id) VALUES (%d, \"%s\", %d);\n",
               $region->{id} + 1, $region->{name}, $region->{country_id} + 1);
    }
    printf("commit;\n");
    printf("-- %d regions\n", $pos);
    printf("\n");

    printf("-- cities\n");
    printf("begin;\n");
    $pos = 0;
    foreach my $city (@cities) {
        ++$pos;
        if ($city->{deleted}) {
            printf STDERR ("Skipping deleted city %d [%s]\n", $city->{id} + 1, $city->{name});
            next;
        }
        printf("INSERT INTO cities (id, name, region_id, country_id, lat, lon, population, external_id) VALUES (%d, \"%s\", %d, %d, %f, %f, %d, \"%s\");\n",
               $city->{id} + 1, $city->{name}, $city->{region_id} + 1, $city->{country_id} + 1,
               $city->{lat}, $city->{lon}, $city->{population}, $city->{external_id});
    }
    printf("commit;\n");
    printf("-- %d cities\n", $pos);
    printf("\n");
}

sub show_country {
    my ($country_id) = @_;

    my $country;
    $country //= $countries[$country_id] if defined $country_id;

    if (!$country) {
        printf STDERR ("Unknown country for id %s\n", $country_id // 'UNDEF');
        return;
    }
    printf STDERR ("Country: [%d:%s] ISO [%s:%s] -- %d cities\n",
                   $country->{id}, $country->{name}, $country->{iso2}, $country->{iso3},
                   scalar @{ $country->{cities} });

    foreach my $region_id (sort { $regions[$a]{name} cmp $regions[$b]{name} } @{ $country->{regions} }) {
        show_region($region_id);
    }
}

sub show_region {
    my ($region_id) = @_;

    my $region;
    $region //= $regions[$region_id] if defined $region_id;
    if (!$region) {
        printf STDERR ("Unknown region for id %s\n", $region_id // 'UNDEF');
        return;
    }

    my $country_id = $region->{country_id};
    my $country;
    $country //= $countries[$country_id] if defined $country_id;
    if (!$country) {
        printf STDERR ("Unknown country for id %s\n", $country_id // 'UNDEF');
        return;
    }

    printf STDERR ("Region: [%d:%s] -- %d cities\n",
                   $region->{id}, $region->{name},
                   scalar @{ $region->{cities} });
    foreach my $city_id (sort { $cities[$a]{name} cmp $cities[$b]{name} } @{ $region->{cities} }) {
        show_city($city_id);
    }
}

sub show_city {
    my ($city_id) = @_;

    my $city;
    $city //= $cities[$city_id] if defined $city_id;
    if (!$city) {
        printf STDERR ("Unknown city for id %s\n", $city_id // 'UNDEF');
        return;
    }

    my $region_id = $city->{region_id};
    my $region;
    $region //= $regions[$region_id] if defined $region_id;
    if (!$region) {
        printf STDERR ("Unknown region for id %s\n", $region_id // 'UNDEF');
        return;
    }

    my $country_id = $region->{country_id};
    my $country;
    $country //= $countries[$country_id] if defined $country_id;
    if (!$country) {
        printf STDERR ("Unknown country for id %s\n", $country_id // 'UNDEF');
        return;
    }

    printf STDERR ("City: pop %10d [%f:%f] (%10s) %5d [%s]\n",
                   $city->{population}, $city->{lat}, $city->{lon}, $city->{external_id},
                   $city->{id}, $city->{name});
}

