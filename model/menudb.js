const nedb = require('nedb-promise');

const menuObjects = require('../menu.json');

const menu = new nedb({ filename: 'menu.db', autoload: true });

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

module.exports = { getMenu };