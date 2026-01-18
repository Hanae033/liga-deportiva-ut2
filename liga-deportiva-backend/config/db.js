const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); // ⚡ Mongoose 7+ no necesita opciones
    console.log("✅ Mongo conectado al cluster:", conn.connection.host);
    console.log("💾 Base de datos:", conn.connection.name);
  } catch (err) {
    console.error("❌ Error Mongo:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

