const User = require("../models/User");   // modelo de usuario
const bcrypt = require("bcryptjs");       // para encriptar la contraseña
const jwt = require("jsonwebtoken");      // para crear token JWT

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { username, password, tipo } = req.body;
    const hash = await bcrypt.hash(password, 10); // encriptar contraseña
    await User.create({ username, password: hash, tipo }); // guardar usuario
    res.json({ msg: "Usuario creado" });
  }catch (error) {
  console.error("ERROR REGISTRO 👉", error);
  res.status(500).json({ error: "Error al registrar usuario" });
}

};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // buscar usuario
    if (!user) return res.status(400).json({ msg: "Usuario no existe" });

    const ok = await bcrypt.compare(password, user.password); // verificar contraseña
    if (!ok) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET); // crear JWT
    res.json({ token, tipo: user.tipo });
  } catch (error) {
    res.status(500).json({ error: "Error al hacer login" });
  }
};
