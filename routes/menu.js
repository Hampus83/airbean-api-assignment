const { Router } = require('express');
const router = Router();

const { getMenu } = require('../model/menudb');

router.get('/', async (request, response) => {
    const result = await getMenu();
    const resObj = {
        success: true,
        menu: result[0].menu
    }

    response.json(resObj);
});

module.exports = router;