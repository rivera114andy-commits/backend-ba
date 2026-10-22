// 1. FORZAR DNS (Para evitar el error de conexión)
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 2. CONEXIÓN A MONGODB
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas correctamente'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// 3. ESQUEMA DE LA RESERVA
const ReservaSchema = new mongoose.Schema({
    nombre: String,
    telefono: String,
    email: String,
    servicio: String,
    fecha: String,
    hora: String,
    fechaRegistro: { type: Date, default: Date.now }
});

const Reserva = mongoose.model('Reserva', ReservaSchema);

// 4. RUTA PARA RECIBIR LOS DATOS
app.post('/api/reservas', async (req, res) => {
    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.status(201).json({ mensaje: 'Reserva guardada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar la reserva', error });
    }
});

// Ruta de prueba
app.get('/', (req, res) => res.send('Servidor del Spa Belleza Angelical funcionando 🚀'));

// 5. ENCENDER EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});