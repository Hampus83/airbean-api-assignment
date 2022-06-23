const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 8000;

const { getMenu, createAccount, checkIfAccountExists, compareCredentials, checkIfUser, createUserOrder, createGuestOrder } = require('./model/db');

app.use(express.json());

app.get('/api/menu', async (request, response) => {
    const result = await getMenu();
    const resObj = {
        success: true,
        menu: result[0].menu
    }

    response.json(resObj);
});

app.post('/api/signup', async (request, response) => {
    const resObj = {
        success: false
    }

    const credentials = request.body;
    const accountExists = await checkIfAccountExists(credentials);

    if (accountExists.length > 0) {
        resObj.message = 'Account already exists';
    } else {
        const result = await createAccount(credentials);

        if (result) {
            resObj.success = true;
            resObj.message = `Account created! Welcome, ${credentials.username}!`;
        }
    }

    response.json(resObj);
});

app.post('/api/login', async (request, response) => {
    const resObj = {
        success: false,
        message: 'Wrong username and/or password'
    }

    const credentials = request.body;
    const result = await compareCredentials(credentials);

    if (result.length > 0) {
        resObj.success = true;
        resObj.message = `Welcome, ${credentials.username}!`;
    }

    response.json(resObj);
});

app.post('/api/order', async (request, response) => {
    const resObj = {
        success: false
    }

    const estTime = Math.floor(Math.random() * 40) + 5;

    const orderItems = request.body;

    const userOrder = await checkIfUser(orderItems);

    if (userOrder.length > 0) {
        createUserOrder(orderItems);
        resObj.success = true;
        resObj.message = `Thank you ${orderItems.username}, your order is on its way!`;
        resObj.order = orderItems.products;
        resObj.ETA = `${estTime} minutes`;
    } else {
        createGuestOrder(orderItems);
        resObj.success = true;
        resObj.message = `Thank you dear guest, your order is on its way!`;
        resObj.order = orderItems.products;
        resObj.ETA = `${estTime} minutes`;
    }

    response.json(resObj);
});

app.listen(PORT, () => {
    console.log(`OK, here we go! Port: ${PORT}`);
});
