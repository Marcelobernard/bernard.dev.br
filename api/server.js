const express = require('express');
const app = require('./server');
const bodyParser = require('body-parser');
const app = express();
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

module.exports = (req, res) => {
    app(req, res);
};