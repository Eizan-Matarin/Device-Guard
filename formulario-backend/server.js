require('dotenv').config(); // 👈 Carga las variables del archivo .env

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
  const { name, email, job, chosenPlan } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Device Guard" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: 'Nuevo formulario de Device Guard',
    text: `
      Nombre: ${name}
      Email: ${email}
      Trabajo: ${job}
      Plan elegido: ${chosenPlan}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true, message: 'Enviado correctamente' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor escuchando en http://localhost:3001');
});
