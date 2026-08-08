const mongoose = require('mongoose');
const app = require('./app');

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/tournament';
const port = Number(process.env.PORT || 5000);

async function start() {
  await mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});
