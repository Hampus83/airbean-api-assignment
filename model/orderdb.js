const nedb = require('nedb-promise');

const guestOrders = new nedb({ filename: 'guestOrders.db', autoload: true });
const userOrders = new nedb({ filename: 'userOrders.db', autoload: true });

async function createUserOrder(orderItems) {
    const products = orderItems.products;
    const orderNumber = await getUserOrderNumber();
    const result = await userOrders.insert({ username: orderItems.username, order: orderItems.products, orderNumber: orderNumber, total: `SEK ${await getOrderTotal(products)}`, estTimeOfDelivery: await setDeliveryTime() });
    
    return result;
}

async function createGuestOrder(orderItems) {
    const products = orderItems.products;
    const orderNumber = await getGuestOrderNumber();
    const result = await guestOrders.insert({ username: orderItems.username, order: orderItems.products, orderNumber: orderNumber, total: `SEK ${await getOrderTotal(products)}`, estTimeOfDelivery: await setDeliveryTime() });

    return result;
}

async function getUserOrderNumber() {
    let userOrderNumber = 1000;
    const count = await userOrders.find({});
    const result = userOrderNumber + count.length + 1;

    return result;
}

async function getGuestOrderNumber() {
    let guestOrderNumber = 5000;
    const count = await guestOrders.find({});
    const result = guestOrderNumber + count.length + 1;

    return result;
}

async function getOrderTotal(products) {
    let total = 0;

    for (let product of products) {
        total = total + product.price;
    }

    return total;
}

async function setDeliveryTime() {
    const deliveryTime = new Date();
    const estTime = Math.floor(Math.random() * 40) + 5;
    deliveryTime.setMinutes(deliveryTime.getMinutes() + estTime);

    return deliveryTime.toLocaleString();
}

async function getUserHistory(user) {
    const result = userOrders.find({ username: user });

    return result;
}

module.exports = { createUserOrder, createGuestOrder, getUserOrderNumber, getGuestOrderNumber, getOrderTotal, getUserHistory };