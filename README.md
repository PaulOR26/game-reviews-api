# Game Reviews Api

## Description

This project was to build an API for the purpose of accessing application data programmatically.

The intention was to mimick the building of a real world backend service (such as reddit) that provides information to a front end architecture.

This API stores, grants access to, and allows modification of game review information as well as the associated user details, by way of a relational PSQL database.

Click here to view the hosted version of this app.
(You might to install a JSON formatter browser extension in order to view the detail in a readable format.)

## Setup

- **Fork** this repo
  ![](readme-screenshot-fork.png)

- **Clone** to your local machine
  run `git clone https://github.com/PaulOR26/game-reviews-api.git`

- **Install** dependencies
  run `npm install`

- **Define environment**

  - Create file: `.env.test`
  - Include within file: `PGDATABASE=game_reviews_test`

  - Create file: `.env.development`
  - Include within file: `PGDATABASE=game_reviews`

  (Double check these files (_as well as your node_modules_) are included within the .gitignore file.)

- **Create the databases** by running `npm run setup-dbs`

- **Seed the databases** by running `npm run seed`

## Testing

- run `npm test app` to test the endpoints
- run `npm test utils` to test the database seeding utility functions

## Requirements

- **Node.js** v16.3.0
- **Postgres** v13.3
