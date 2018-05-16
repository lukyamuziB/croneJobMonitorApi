/*
*create and export configuration variables
*
*/

// Container for all environments

const envs = {};

//staging {default} environment

envs.staging = {
    'port' : 3000,
    'envName' : 'staging'
};

//Production environmnet
envs.production = {
    'port' : 5000,
    'envName' : 'production'
};

//determine which environment is passed on the terminal
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase : '';

//check to see if env exists or default to staging
const environmentToExport = typeof(envs[currentEnvironment]) == 'object' ? envs[currentEnvironment] : envs.staging;

module.exports = environmentToExport;