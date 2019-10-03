select 'most populated cities';
select Y.name as country, R.name as region, C.id, C.name as city, C.lat, C.lon, C.population
from countries Y join cities C on Y.id = C.country_id join regions R on R.id = C.region_id
where C.population >= 10000000
order by 7 desc, 1, 2, 3;

select 'most populated countries (from the cities we know about those countries)';
select Y.name as country, sum(C.population) as population
from countries Y join cities C on Y.id = C.country_id
group by 1
having sum(C.population) > 50000000
order by 2 desc, 1;

select 'all continents that have different-looking name but that UTF8 considers equal (case and accent insensitive)';
select C1.id, C1.name, C2.id, C2.name
from continents C1,
     continents C2
where C1.id < C2.id and
      C1.name = C2.name collate utf8mb4_general_ci;

select 'all countries that have different-looking name but that UTF8 considers equal (case and accent insensitive)';
select C1.id, C1.name, C2.id, C2.name
from countries C1,
     countries C2
where C1.id < C2.id and
      C1.name = C2.name collate utf8mb4_general_ci;

select 'all regions that have different-looking name but that UTF8 considers equal (case and accent insensitive)';
select R1.id, R1.name, R2.id, R2.name
from regions R1,
     regions R2
where R1.id < R2.id and
      R1.country_id = R2.country_id and
      R1.name = R2.name collate utf8mb4_general_ci;

select 'all cities that have different-looking name but that UTF8 considers equal (case and accent insensitive)';
select C1.id, C1.name, C2.id, C2.name
from cities C1,
     cities C2
where C1.id < C2.id and
      C1.region_id = C2.region_id and
      C1.country_id = C2.country_id and
      C1.name = C2.name collate utf8mb4_general_ci;

select 'countries from Oceania that have at least one city in region OTHER';
select Y.id, Y.name as country, R.id, R.name as region, C.id, C.name as city, C.lat, C.lon, C.population
from countries Y join cities C on Y.id = C.country_id join regions R on R.id = C.region_id join continents T on Y.continent_id = T.id
where R.name = 'OTHER' and T.name like 'Oceania'
order by 2, 4, 6;

select 'cities in different countries that are very close to each other';
select N.name as continent, Y1.name as country, C1.name as city, Y2.name as country, C2.name as city
from cities C1 join countries Y1 on C1.country_id = Y1.id join continents N on Y1.continent_id = N.id,
     cities C2 join countries Y2 on C2.country_id = Y2.id
where C1.id < C2.id and
      C1.country_id != C2.country_id and
      abs(C1.lat - C2.lat) <= 0.01 and
      abs(C1.lon - C2.lon) <= 0.1 and
      N.id in (1, 3) -- only Europe and America
order by 1, 2, 3;
