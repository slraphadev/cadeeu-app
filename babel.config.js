module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // As migrações do Drizzle são arquivos .sql embutidos no bundle como texto.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
