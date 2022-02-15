# BC NC-News

## Connect to databases locally


### Required NPM packages

In order to set up and connect to your development and test databases locally, you will need to install the following npm modules in your project directory:

- dotenv (https://www.npmjs.com/package/dotenv)
- pg (https://www.npmjs.com/package/pg)

The versions used in development were (dotenv: 16.0.) and (pg: 8.7.3).


### Setting environment variables

You will also need to set up .env.development and .env.test files in your project directory to include a reference to your development and test database names respectively with the environment variable PGDATABASE.

e.g. PGDATABASE='your-database-name-here'