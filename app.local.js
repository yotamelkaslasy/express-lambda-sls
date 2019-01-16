const server = require('./app');

const port = 3000;

server.listen(port, () =>
  console.log(`Server is listening on port ${port}...`)
);

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
});
