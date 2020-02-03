const http = require('http');

const main = function() {
  const server = new http.Server();
  server.listen(8000);
};
main();
