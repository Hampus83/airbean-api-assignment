const nedb = require('nedb-promise');

const menuObjects = require('../menu.json');

const menu = new nedb({ filename: 'menu.db', autoload: true });
const accounts = new nedb({ filename: 'accounts.db', autoload: true });

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

module.exports = { getMenu, createAccount, checkIfAccountExists, compareCredentials };