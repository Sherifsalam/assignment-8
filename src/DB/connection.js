// connection.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://sherif_ehab22:11ILFw5r4v2oeGB8@cluster0.loevxhf.mongodb.net/?appName=Cluster0",
    );
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // stop crashing silently
  }
};

// Handle unexpected disconnects
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected ⚠️");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose error:", err);
});
