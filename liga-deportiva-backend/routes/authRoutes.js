const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Endpoint para registrar usuario
router.post("/register", register);

// Endpoint para login
router.post("/login", login);

module.exports = router;
