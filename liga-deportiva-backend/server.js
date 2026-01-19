const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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

// SCHEMAS
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

// REGISTRO
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, type } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario o email ya existe' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, type: type || 'normal' });
    await user.save();
    console.log('✅ Usuario guardado:', username);
    res.status(201).json({ message: 'Usuario creado exitosamente', username: user.username, type: user.type });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, type: user.type },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    console.log('✅ Login exitoso:', username);
    res.json({ token, userType: user.type, username: user.username });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// USUARIOS
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PARTIDOS
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/matches', authenticateToken, async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    console.log('✅ Partido creado');
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/matches/:id', authenticateToken, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partido eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/matches/:id/score', authenticateToken, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
    match.scoreA = req.body.scoreA;
    match.scoreB = req.body.scoreB;
    match.status = 'review';
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/matches/:id', authenticateToken, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) return res.status(404).json({ message: 'Partido no encontrado' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// EQUIPOS
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/teams', authenticateToken, async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RUTA RAÍZ
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

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('✅ Servidor escuchando en puerto', PORT);
});