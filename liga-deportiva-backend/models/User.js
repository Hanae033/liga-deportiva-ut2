const mongoose = require("mongoose");

// Creamos un esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // nombre de usuario
  password: { type: String, required: true }, // contraseña (hashed)
  tipo: { type: String, required: true }     // admin, normal, capitan, arbitro
});

// Exportamos el modelo para usarlo en otros archivos
module.exports = mongoose.model("User", userSchema);
