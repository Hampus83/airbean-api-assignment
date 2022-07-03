const nedb = require('nedb-promise');

const accounts = new nedb({ filename: 'accounts.db', autoload: true });

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

module.exports = { createAccount, checkIfAccountExists, compareCredentials, checkIfUser }