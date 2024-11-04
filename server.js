// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para enviar la URL de la API al front-end
app.get('/config', (req, res) => {
    res.json({ apiUrl: process.env.API_URL });
});


app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
