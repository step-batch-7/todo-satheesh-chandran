const { app } = require('./lib/routes');

const port = 8000;

const main = function() {
  app.listen(port, () => process.stdout.write(`Listening at ${port}`));
};

main();
