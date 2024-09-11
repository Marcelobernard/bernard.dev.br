const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

app.get('/api', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.get('/api/*', (req, res) => {
  res.status(404).send('Rota não encontrada');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'mobile.html'));
});

app.post('/api/order', (req, res) => {
    const orderData = req.body;
    console.log('Pedido recebido:', orderData);
    res.status(200).json({ message: 'Pedido recebido com sucesso!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});