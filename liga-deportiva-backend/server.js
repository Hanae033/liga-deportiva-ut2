const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 👉 Servir Angular
app.use(express.static(path.join(__dirname, '../dist/liga-deportiva-ut2')));

console.log('=================================');
console.log('🚀 Servidor iniciando...');
console.log('=================================');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/LigaDeportiva')
  .then(() => {
    console.log('=================================');
    console.log('✅ Servidor corriendo en http://localhost:' + PORT);
    console.log('💾 Base de datos: MongoDB Atlas');
    console.log('=================================');
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
  });

mongoose.connection.on('connected', () => {
  const cluster = mongoose.connection.host;
  const dbName = mongoose.connection.name;
  console.log(`✅ Mongo conectado al cluster: ${cluster}`);
  console.log(`💾 Base de datos: ${dbName}`);
});

// ------------------ SCHEMAS ------------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['admin', 'normal', 'capitan', 'arbitro'], default: 'normal' },
  teamId: String,
  createdAt: { type: Date, default: Date.now }
});

const matchSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  referee: { type: String, required: true },
  scoreA: Number,
  scoreB: Number,
  status: { type: String, enum: ['pending', 'finished', 'review'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  captain: { type: String, required: true },
  players: [String],
  wins: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
});

// MODELS
const User = mongoose.model('User', userSchema);
const Match = mongoose.model('Match', matchSchema);
const Team = mongoose.model('Team', teamSchema);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==================== RUTAS API ====================
// (TODO tu código igual, sin tocar)

// RUTA RAÍZ API
app.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const matchCount = await Match.countDocuments();
    const teamCount = await Team.countDocuments();
    res.json({ 
      message: '✅ API de Liga Deportiva funcionando',
      version: '1.0.0',
      database: 'MongoDB Atlas',
      connected: mongoose.connection.readyState === 1,
      usuarios: userCount,
      partidos: matchCount,
      equipos: teamCount
    });
  } catch (error) {
    res.json({
      message: 'API funcionando',
      error: error.message
    });
  }
});

// 👉 ESTA ES LA CLAVE (siempre al final)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/liga-deportiva-ut2/index.html'));
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('Servidor escuchando en puerto', PORT);
});

