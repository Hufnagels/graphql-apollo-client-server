import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_SERVER_ADDRESS = process.env.MONGODB_SERVER_ADDRESS
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

mongoose.connect(`mongodb://${MONGODB_SERVER_ADDRESS}:27017/${MONGODB_DB}`, {
    "auth": { "authSource": "admin" },
    "user": `${MONGODB_USERNAME}`,
    "pass": `${MONGODB_PASSWORD}`,
    // "useMongoClient": true,
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error to MongoDB: "));
// db.once("open", function () {
//   console.log("Connected successfully to MongoDB");
// });

export default db;