const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());

let orders = [];

app.post('/orders', (req, res) => {
    const order = req.body;
    orders.push(order);
    res.status(200).send('Pedido recebido com sucesso!');
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});