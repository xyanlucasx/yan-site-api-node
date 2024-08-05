const express = require('express');
const router = express.Router();
const useCases = require('../use-cases/authentication.js');

router.post('/', async (req, res) => {
    const { body } = req;
    try {
        const result = await useCases.authentication(body);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Authentication error');
    }
});


module.exports = router;

