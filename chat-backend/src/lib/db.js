import mongoose from "mongoose";
export const dbConnection = async () => {
  try {
    console.log("MongoDB is Connecting...");
    const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("DB Connected Successfully:", conn.connection.host);
  } catch (error) {
    console.error("Error in Connection MongoDB:", error.message);
    process.exit(1); // Exit process on failure
  }
};
