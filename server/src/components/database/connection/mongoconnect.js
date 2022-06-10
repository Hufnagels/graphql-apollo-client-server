import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_SERVER_ADDRESS = process.env.MONGODB_SERVER_ADDRESS
const MONGODB_DB = process.env.MONGODB_DB;
const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

const connectionParams = {
	// "auth": { "authSource": "admin" },
	// "user": `${MONGODB_USERNAME}`,
	// "pass": `${MONGODB_PASSWORD}`,
	//useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true 
}
const url = `mongodb+srv://pisti:Mancika72@gqlwb01.zodzq.mongodb.net/mindmap?retryWrites=true&w=majority` //`mongodb://${MONGODB_SERVER_ADDRESS}:27017/${MONGODB_DB}`

mongoose.connect(url, connectionParams);
// mongoose.connect(`mongodb+srv://pisti:Mancika72@gqlwb01.zodzq.mongodb.net/mindmaps?retryWrites=true&w=majority`,
// 	// {
// 	//   // "auth": { "authSource": "admin" },
// 	//   // "user": `${MONGODB_USERNAME}`,
// 	//   // "pass": `${MONGODB_PASSWORD}`,
// 	//   // "useMongoClient": true,
// 	//   useNewUrlParser: true,
// 	//   //useCreateIndex: true,
// 	//   useUnifiedTopology: true,
// 	// }
// );

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error to MongoDB: "));

export default db;