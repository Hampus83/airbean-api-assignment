const express = require('express');
const app = express();
const PORT = 8000;

const { getMenu, createAccount, checkIfAccountExists, compareCredentials } = require('./model/db');

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



app.listen(PORT, () => {
    console.log(`OK, here we go! Port: ${PORT}`);
});
