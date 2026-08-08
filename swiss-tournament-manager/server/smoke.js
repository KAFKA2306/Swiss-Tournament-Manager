const app = require('./app');

const server = app.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  console.log(`Server smoke test listening on ${port}`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
});

server.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
