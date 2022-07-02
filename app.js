const express = require('express');
const app = express();
const PORT = 8000;

const { getMenu, createAccount, checkIfAccountExists, compareCredentials, checkIfUser, createUserOrder, createGuestOrder, getUserOrderNumber, getGuestOrderNumber, getOrderTotal, getUserHistory, setDeliveryTime } = require('./model/db');

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

    const orderItems = request.body;
    const products = request.body.products;

    const userOrder = await checkIfUser(orderItems);

    if (orderItems.products.length === 0) {
        resObj.message = 'You have to add a product to make an order';

    } else if (userOrder.length > 0) {
        createUserOrder(orderItems);
        resObj.success = true;
        resObj.message = `Thank you ${orderItems.username}, your order is on its way!`;
        resObj.order = orderItems.products;
        resObj.total = `SEK ${await getOrderTotal(products)}`;
        resObj.orderNr = await getUserOrderNumber();
        // resObj.ETA = orderItems.estTimeOfDelivery;

    } else {
        createGuestOrder(orderItems);
        resObj.success = true;
        resObj.message = `Thank you dear guest, your order is on its way!`;
        resObj.order = orderItems.products;
        resObj.total = `SEK ${ await getOrderTotal(products)}`;
        resObj.orderNr = await getGuestOrderNumber();
        // resObj.ETA = await setDeliveryTime();
    }
    
    response.json(resObj);
});

app.get('/api/order/:user', async (request, response) => {
    const resObj = {
        success: false,
        message: 'Sorry, you are not logged in'
    }

    const user = request.params.user;

    const result = await getUserHistory(user);

    const history = [];

    // console.log(Date.now() / 1000);

    for (let i = 0; i < result.length; i++) {
        let delivered = false;

        const timeOfSearch = new Date().toLocaleTimeString();
        console.log(timeOfSearch);
        // const timeBetween = Number(result[i].estTimeOfDelivery) - Number(timeOfSearch);
        // console.log(timeBetween);
        if (timeOfSearch > result[i].estTimeOfDelivery) {
            console.log('delivered');
            delivered = true;
        }

        const userHistory = {
            orderNumber: result[i].orderNumber,
            orderTotal: result[i].total,
            ETA: result[i].estTimeOfDelivery,
            delivered: delivered
        }

        // console.log(result[i].estTimeOfDelivery);

        history.push(userHistory);

        if (result.length > 0) {
            resObj.success = true;
            resObj.message = `Here is the order-history for user ${user}`;
            resObj.orderHistory = history; 
        }
    }

    response.json(resObj);
});

app.listen(PORT, () => {
    console.log(`OK, here we go! Port: ${PORT}`);
});