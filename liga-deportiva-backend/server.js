const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// PARTIDOS en memoria
let matches = [];

console.log('=================================');
console.log('🚀 Servidor iniciando...');
console.log('=================================');

// ============================
// RUTAS API
// ============================

// REGISTRO
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, type } = req.body;
    console.log('📝 Intento de registro:', username);

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      console.log('❌ Usuario ya existe:', username);
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      tipo: type || 'normal',
    });

    await user.save();
    console.log('✅ Usuario creado en MongoDB:', username);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      username: user.username,
      type: user.tipo
    });
  } catch (error) {
    console.error('❌ Error en registro:', error.message);
    res.status(500).json({ message: 'Error al crear usuario: ' + error.message });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Intento de login:', username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ Usuario no encontrado:', username);
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('❌ Contraseña incorrecta para:', username);
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, type: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login exitoso:', username);

    res.json({
      token,
      userType: user.tipo,
      username: user.username
    });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({ message: 'Error al iniciar sesión: ' + error.message });
  }
});

// PARTIDOS
app.get('/api/matches', (req, res) => {
  console.log('📋 Consultando partidos. Total:', matches.length);
  res.json(matches);
});

app.post('/api/matches', (req, res) => {
  try {
    const match = {
      _id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    };
    matches.push(match);
    console.log('⚽ Partido creado:', match.teamA, 'vs', match.teamB);
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================
// SERVIR FRONTEND ANGULAR
// ============================


const angularDistPath = path.join(__dirname, '../src/dist/liga-deportiva-ut2');

app.use(express.static(angularDistPath));


app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(angularDistPath, 'index.html'));
  }
});


app.listen(PORT, () => {
  console.log('=================================');
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('💾 Base de datos: MongoDB Atlas');
  console.log('=================================');
});
