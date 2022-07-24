const { Router } = require('express');
const router = Router();

const { createUserOrder, createGuestOrder, getUserOrderNumber, getGuestOrderNumber, getOrderTotal, getUserHistory } = require('../model/orderdb');
const { checkIfUser } = require('../model/accountdb')


router.post('/', async (request, response) => {
    const resObj = {
        success: false
    }

    const orderItems = request.body;
    const products = request.body.products;

    const userOrder = await checkIfUser(orderItems);

    if (orderItems.products.length === 0) {
        resObj.message = 'Product needs to be added to make an order';

    } else if (userOrder.length > 0) {
        createUserOrder(orderItems);
        resObj.success = true;
        resObj.message = `Order placed by user: ${orderItems.username}`;
        resObj.order = orderItems.products;
        resObj.total = `SEK ${await getOrderTotal(products)}`;
        resObj.orderNr = await getUserOrderNumber();
    } else {
        createGuestOrder(orderItems);
        resObj.success = true;
        resObj.message = `Order placed by 'guest'`;
        resObj.order = orderItems.products;
        resObj.total = `SEK ${ await getOrderTotal(products)}`;
        resObj.orderNr = await getGuestOrderNumber();
    }
    
    response.json(resObj);
});

router.get('/:user', async (request, response) => {
    const resObj = {
        success: false,
        message: 'Not logged in'
    }

    const user = request.params.user;
    const result = await getUserHistory(user);
    const history = [];

    for (let i = 0; i < result.length; i++) {
        let delivered = false;

        const timeOfSearch = new Date().toLocaleString();

        if (timeOfSearch > result[i].estTimeOfDelivery) {
            delivered = true;
        }

        const userHistory = {
            orderNumber: result[i].orderNumber,
            orderTotal: result[i].total,
            ETA: result[i].estTimeOfDelivery,
            delivered: delivered
        }

        history.push(userHistory);

        if (result.length > 0) {
            resObj.success = true;
            resObj.message = `Order-history for user ${user}`;
            resObj.orderHistory = history;
        }
    }

    response.json(resObj);
});

module.exports = router;