const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares/checkAuth');
const useCases = require('../use-cases/states.js');

router.get('/', async (req, res) => {
    try {
    const states = await useCases.listStates()

    res.status(200).send(states)
    } catch (err) {
        console.log(err)
        res.status(500).send('Erro ao listar estados');
    }
}
);

router.post('/', checkToken, async (req, res) => {
    const { body } = req;
    try {
        const result = await useCases.uploadState(body);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao enviar estado');
    }
});

router.patch('/:id', checkToken, async (req, res) => {
    const { body, params } = req;
    try {
        const result = await useCases.editState(params.id, body);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao editar estado');
    }
});

router.delete('/:id', checkToken, async (req, res) => {
    const { params } = req;
    try {
        await useCases.deleteState(params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar estado');
    }
});

module.exports = router;