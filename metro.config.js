const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite importar as migrações .sql geradas pelo Drizzle.
config.resolver.sourceExts.push('sql');

module.exports = config;
