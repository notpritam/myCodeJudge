import mongoose from "mongoose";

const connect = () => {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database-name";
    mongoose.connect(uri, { dbName: "MyCodeJudge" });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("MongoDB database connection established successfully!");
    });
  } catch (e) {
    console.log(e);
  }
};

export default connect;
