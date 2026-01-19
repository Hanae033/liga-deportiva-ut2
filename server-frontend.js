const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'dist/liga-deportiva-ut2/browser')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/liga-deportiva-ut2/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Frontend corriendo en puerto ${PORT}`);
});