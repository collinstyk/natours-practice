/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

if (process.env.NODE_ENV !== 'production') {
  // configured for vercel
  dotenv.config({ path: './config.env' });
}

const app = require('../app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// async function main() {
//   await mongoose.connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   });
//   console.log('DB connection successful!');
// }

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('DB connection successful!');
}

// main();

// 4) START SERVER
// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

module.exports = async (req, res) => {
  await connectDB;
  app(req, res);
};

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
  process.exit(1);
});
