# Fossil Finds Back End

Fossil Finds is a web application allowing members of the public and researchers alike to search and contribute to a database of fossil finds in the UK. Fossil Finds Back End - the content of this repository - is the relational database (POSTGRES) and API used by Fossil Finds.

[Click here to access the web application] (https://fossil-finds.netlify.app/)

[Click here to access the API] (https://fossil-finds.herokuapp.com/api)

[Click here to see the Fossil Finds Front-End repository] (https://github.com/Roothebear/fossil-finds-fe)

I built Fossil Finds as part of my time on the Northcoders Software Development Bootcamp (https://northcoders.com/).


## Local Development Set-Up

The information below will give you all the information required to set up this project yourself.

### Pre-requisites

Install Node.js which acts as the runtime environment for this project. This should also install npm to manage all of the
required dependencies.

[Follow this link to download Node.js with npm]. (https://nodejs.org/en/download/current/)

Minimum version recommended: Node v16.8.0

Install PostgreSQL which is used as the database server for this project.

[Follow this link to download PostgreSQL]. (https://www.postgresql.org/download/)

Minimum version recommended: PostgreSQL v13.4

### Clone Repository
To clone the repository for access on your local machine, run the following command in your terminal:

`git clone https://github.com/roothebear/fossil-finds-be.git`

### Required NPM packages

In order to set up and connect to your development and test databases locally, you will need to install the following npm modules in your project directory:

- dotenv (https://www.npmjs.com/package/dotenv)
- pg (https://www.npmjs.com/package/pg)
- pg-format (https://www.npmjs.com/package/pg-format)
- express (https://www.npmjs.com/package/express)
  

The versions used in development were 

- dotenv: 16.0.0
- pg: 8.7.3
- pg-format: 1.0.4
- express: 4.17.2


### Setting environment variables

You will also need to set up .env.development and .env.test files in your project directory to include a reference to your development and test database names respectively with the environment variable PGDATABASE.

- In .env.development file: PGDATABASE=your-database-name-here
- In .env.test file: PGDATABASE=your-database-name-here-test

### Setup Databases

To create the Postgres databases for both the tests and for the local server, run the following command in your terminal:

`npm run setup-dbs`

To seed the local server database, run the following command in your terminal:

`npm run seed`

The test database does not need to be seeded manually as it is seeded before every test is run.

### Run Tests
To run all test suites, run the following command in your terminal:

`npm test`

### Run Local Server
To run the server on your local machine, run the following command in the terminal:

`npm run start`

You should see a message in the console that tells you the app is listening on the port defined in the code.