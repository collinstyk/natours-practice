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

let cachedDB = null; // This will store the cached connection

async function connectDB() {
  // If the connection is already cached, return it
  if (cachedDB) {
    return cachedDB;
  }

  try {
    // If not cached, create a new connection
    const client = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    // Cache the connection and return it
    cachedDB = client;
    console.log('DB connection successful!');
    return cachedDB;
  } catch (err) {
    console.error('DB connection error:', err);
    throw new Error('Failed to connect to the database');
  }
}

// let isConnected = false;
// let cachedDB = null;

// async function connectDB() {
//   if (isConnected) return;
//   if (cachedDB) return cachedDB;

//   const client = await mongoose.connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   });
//   isConnected = true;
//   cachedDB = client;
//   console.log('DB connection successful!');
// }

// main();

// 4) START SERVER
// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// module.exports = async (req, res) => {
//   await connectDB;
//   app(req, res);
// };

module.exports = async (req, res) => {
  try {
    await connectDB(); // Ensure DB connection before handling the request
    app(req, res); // Delegate the request to the Express app
  } catch (error) {
    res.status(500).send('Database connection failed');
  }
};

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
  process.exit(1);
});
