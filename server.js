const { app } = require('./lib/routes');
const { createDataDir } = require('./lib/fileSystems');

const PORT = process.env.PORT || 8000;

const main = function() {
  createDataDir('data');
  app.listen(PORT, () => process.stdout.write(`Listening at ${PORT}`));
};

main();
