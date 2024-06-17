import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function connect() {
  try {
    const connection = await mongoose.connect(
      `mongodb+srv://ruchi:${process.env.DBPASSWORD}@cluster0.ef82glc.mongodb.net/test`
    );
    console.log(`Server running at : ${process.env.PORT}`);
  } catch (e) {
    console.log("Error: " + e);
  }
}
export default connect();
