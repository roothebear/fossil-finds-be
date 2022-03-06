# Fossil Finds Back End

Fossil Finds is a web application allowing members of the public and researchers alike to search and contribute to a database of fossil finds in the UK. Fossil Finds Back End - the content of this repository - is the relational database (POSTGRES) and API used by Fossil Finds.


## Connect to databases locally



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