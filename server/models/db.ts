const mongoose = require("mongoose");
require("dotenv").config();

const { DB_URL, DB_NAME } = process.env;

console.log(`DB_URL:${DB_URL}, DB_NAME: ${DB_NAME}`);

mongoose
  .connect(DB_URL, { dbName: DB_NAME })
  .then(() => {
    console.log(`Connected to MongoDB (database: ${DB_NAME})`);
  })
  .catch((err: any) => {
    console.log(err);
  });

mongoose.connection.on("error", (err: any) => {
  console.log(err);
});

module.exports = mongoose;
