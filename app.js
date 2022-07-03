const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

const accountRouter = require('./routes/account');
const menuRouter = require('./routes/menu');
const orderRouter = require('./routes/order');

app.use('/api/account', accountRouter);
app.use('/api/menu', menuRouter);
app.use('/api/order', orderRouter);

app.listen(PORT, () => {
    console.log(`OK, here we go! Port: ${PORT}`);
});