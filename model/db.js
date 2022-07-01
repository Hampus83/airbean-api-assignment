const nedb = require('nedb-promise');

const menuObjects = require('../menu.json');

const menu = new nedb({ filename: 'menu.db', autoload: true });
const accounts = new nedb({ filename: 'accounts.db', autoload: true });
const guestOrders = new nedb({ filename: 'guestOrders.db', autoload: true });
const userOrders = new nedb({ filename: 'userOrders.db', autoload: true });

async function getMenuDatabase() {
    const result = await menu.find({});
    if (result.length === 0) {
        menu.insert(menuObjects);
    }
}

getMenuDatabase();

async function getMenu() {
    const result = await menu.find({});
    return result;
}

async function createAccount(account) {
    const result = await accounts.insert(account);
    return result;
}

async function checkIfAccountExists(credentials) {
    const result = await accounts.find({ username: credentials.username });
    return result;
}

async function compareCredentials(credentials) {
    const result = await accounts.find({ $and: [{ username: credentials.username }, { password: credentials.password }] });
    return result;
}

async function checkIfUser(orderItems) {
    const result = await accounts.find({ username: orderItems.username });
    return result;
}

async function createUserOrder(orderItems) {
    const products = orderItems.products;

    const orderNumber = await getUserOrderNumber();
    const result = await userOrders.insert({ username: orderItems.username, order: orderItems.products, orderNumber: orderNumber, total: `SEK ${await getOrderTotal(products)}`, orderTime: await setOrderTime() });
    
    return result;
}

async function createGuestOrder(orderItems) {
    const products = orderItems.products;
    
    const orderNumber = await getGuestOrderNumber();
    const result = await guestOrders.insert({ username: orderItems.username, order: orderItems.products, orderNumber: orderNumber, total: `SEK ${await getOrderTotal(products)}`, orderTime: await setOrderTime() });
    
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

async function setOrderTime() {
    const orderTime = new Date().toLocaleTimeString()
    console.log(`time of order: ${orderTime}`);

    return orderTime;
}

async function getUserHistory(user) {
    const result = userOrders.find({ username: user });

    return result;
}

module.exports = { getMenu, createAccount, checkIfAccountExists, compareCredentials, checkIfUser, createUserOrder, createGuestOrder, getUserOrderNumber, getGuestOrderNumber, getOrderTotal, getUserHistory };