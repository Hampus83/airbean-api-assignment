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
    const result = await userOrders.insert({ orderItems });
    return result;
}

async function createGuestOrder(orderItems) {
    const result = await guestOrders.insert({ username: orderItems.username, order: orderItems.products });
    return result;
}

module.exports = { getMenu, createAccount, checkIfAccountExists, compareCredentials, checkIfUser, createUserOrder, createGuestOrder };