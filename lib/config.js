/*
*create and export configuration variables
*
*/

// Container for all environments

const envs = {};

//staging {default} environment

envs.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret': 'hashing secret'
};

//Production environmnet
envs.production = {
    'httpPort' : 5000,
    'httpsPort': 50001,
    'envName' : 'production',
    'hashingSecret': 'hashing secret'
};

//determine which environment is passed on the terminal
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase : '';

//check to see if env exists or default to staging
const environmentToExport = typeof(envs[currentEnvironment]) == 'object' ? envs[currentEnvironment] : envs.staging;

module.exports = environmentToExport;
