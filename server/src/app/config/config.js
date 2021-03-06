import dotenv from 'dotenv'
dotenv.config()

export const {
  MONGODB_SERVER_ADDRESS,
  MONGODB_DB,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  JWT_TOKEN_SECRET,
  JWT_TOKEN_EXPIRES_IN,
  JWT_REFRESHTOKEN_SECRET,
  JWT_REFRESHTOKEN_EXPIRES_IN,
  PORT,
  ORIGIN,
} = process.env


/**
 * mongodb+srv://pisti:<password>@gqlwb01.zodzq.mongodb.net/?retryWrites=true&w=majority
 */