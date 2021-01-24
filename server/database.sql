/* Contains all the commands to create the database and the tables */

/* Set up */
CREATE TYPE rarity_types AS ENUM ('very common', 'common', 'uncommon', 'rare', 'very rare', 'extremely rare');
CREATE TYPE difficulty_types AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE game_mode_types AS ENUM ('race', 'category', 'hunting');
CREATE TYPE acquisition_types AS ENUM ('hunting', 'trading');

/* 1. Create the database*/
CREATE DATABASE adhunt;

/* 2. Create the users table */
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    owns_plugin boolean NOT NULL,
    score int NOT NULL
);

/* 3. Create the organisations table */
CREATE TABLE organisations(
    organisation_id SERIAL PRIMARY KEY,
    organisation_name VARCHAR(150) NOT NULL,
    organisation_location VARCHAR(100) NOT NULL,
    organisation_description VARCHAR(150) NOT NULL,
    points int NOT NULL,
    rarity rarity_types NOT NULL
);

/* 4. Create the achievements table */
CREATE TABLE achievements(
    achievement_id SERIAL PRIMARY KEY,
    difficulty difficulty_types NOT NULL,
    title VARCHAR(100) NOT NULL,
    game_mode game_mode_types NOT NULL,
    achievement_description VARCHAR(150) NOT NULL 
);

/* 5. Create the user metrics table */
CREATE TABLE user_metrics(
    user_id int PRIMARY KEY REFERENCES users(user_id),
    race_games int NOT NULL,
    category_games int NOT NULL,
    total_ad_trackers int NOT NULL,
    categories_count int[] /* here each entry will be the number of ads seen in a specific category*/
);

/* 6. Create the user achievements table */
CREATE TABLE user_achievements(
    user_id int NOT NULL REFERENCES users(user_id),
    achievement_id int NOT NULL REFERENCES achievements(achievement_id),
    date_completed DATE,
    completed boolean NOT NULL,
    PRIMARY KEY (user_id, achievement_id)
);

/* 7. Create the user organisations table */
CREATE TABLE user_organisations(
    user_id int NOT NULL REFERENCES users(user_id),
    organisation_id int NOT NULL REFERENCES organisations(organisation_id),
    times_found int NOT NULL,
    date_found_first DATE,
    found_url VARCHAR(200),
    acquired_from acquisition_types,
    PRIMARY KEY (user_id, organisation_id)
);

/* 8. Create game history table */
CREATE TABLE game_history(
    game_id SERIAL PRIMARY KEY,
    winner_id int REFERENCES users(user_id) NOT NULL,
    game_mode game_mode_types NOT NULL,
    game_date DATE NOT NULL,
    player_stats jsonb NOT NULL,
    game_stats jsonb NOT NULL
);

/* 9. Create the market table */
CREATE TABLE market(
    trade_id SERIAL PRIMARY KEY NOT NULL,
    player_1_id int REFERENCES users(user_id) NOT NULL,
    player_2_id int REFERENCES users(user_id),
    offering_organisation_id int REFERENCES organisations(organisation_id), 
    offerred_organisation_id int REFERENCES organisations(organisation_id),
    active boolean NOT NULL,
    date_started DATE NOT NULL,
    date_finished DATE,
    offered boolean NOT NULL
);

/* Below are the commands to insert one row of dummy data into each table
   Note that we have to insert data in a specific order in order for this to work
   For example, if a table has a foreign key referencing some row in another table, 
   that row must exist or else we get a constraint error 
   
   Insert data for the user with the user name 'test_user' that already exists in the database by registering
*/

/* 1. Insert dummy data for an organisation */
INSERT INTO organisations(
    organisation_name, 
    organisation_location, 
    organisation_description, 
    points, 
    rarity)
VALUES ('Google', 'USA', 'A tech company', 10, 'very common');

/* 2. Insert dummy data for an achievement */
INSERT INTO achievements(
    difficulty,
    title,
    game_mode,
    achievement_description)
VALUES ('easy', 'Catch me if you can [I]', 'race', 'Play 10 games of race game mode');

/* 3. Insert dummy data for user_metrics for user with user id 6 (test_user) */
INSERT INTO user_metrics(
    user_id,
    race_games,
    category_games,
    total_ad_trackers,
    categories_count
)
VALUES (6, 0, 0, 0, {0,0,0,0,0}); /* for now the array will contain counts only for 5 categories */

/* 4. Insert dummy data for user_achievements for user with user id 6 (test_user) */
INSERT INTO user_achievements(
    user_id,
    achievement_id,
    date_completed,
    completed
)
VALUES (6, 1, NULL, false);

/* 5. Insert dummy data for user_organisations for user with user id 6 (test_user) */
INSERT INTO user_organisations(
    user_id,
    organisation_id,
    times_found,
    date_found_first,
    found_url,
    acquired_from
)
VALUES (6, 1, 0, NULL, NULL, NULL);

/* 6. Insert dummy data for game_history table for a game of type race*/
INSERT INTO game_history(
    winner_id,
    game_mode,
    game_date,
    player_stats,
    game_stats
)
VALUES (6, 'race', '2020-12-07', 
        '{"test_user" : {"page_history":[{"www.example.com": 20,
                                    "www.another-example.com": 15,
                                    "www.lots-of-trackers.com": 65}],
                   "total_score": 100 }}',
        '{"time_elapsed" : 13.12,
          "winners": {"1st":"test_user", "2nd":"None", "3rd":"None"},
          "ad_trackers_required": 100,}');


/* 7. Insert dummy data into the market table */
INSERT INTO market(
    player_1_id,
    player_2_id,
    offering_organisation_id,
    offerred_organisation_id,
    active,
    date_started,
    date_finished,
    offered
)
VALUES (6, NULL, 1, NULL, true, '2020-12-07', NULL, false);

