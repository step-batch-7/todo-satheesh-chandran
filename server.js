const { app } = require('./lib/routes');

const PORT = process.env.PORT || 8000;

const main = function() {
  app.listen(PORT, () => process.stdout.write(`Listening at ${PORT}`));
};

main();
