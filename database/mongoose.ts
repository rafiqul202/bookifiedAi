import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define the mongodb uri environment variable")
};
declare global{
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
};
let cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI,{bufferCommands:false})
  };
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Mongodb connection error. please make sure mongodb is something wrong", error);
    throw error;
  };
  console.info("Connected to mongodb");
  return cached.conn;
};

export default connectToDatabase;