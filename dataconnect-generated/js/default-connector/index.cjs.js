const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Ureno_webdesign',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

