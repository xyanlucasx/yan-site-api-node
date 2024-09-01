const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares/checkAuth');
const useCases = require('../use-cases/tags.js');

router.get('/', async (req, res) => {
    try {
    const tags = await useCases.listTags()

    res.status(200).send(tags)
    } catch (err) {
        console.log(err)
        res.status(500).send('Erro ao listar tags');
    }
}
);

router.post('/', checkToken, async (req, res) => {
    const { body } = req;
    try {
        const result = await useCases.uploadTag(body);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao enviar tag');
    }
});

router.post('/sync', checkToken, async (req, res) => {
    const { body } = req;
    try {
        await useCases.sync(body);
        res.status(201).send(null);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao enviar tag');
    }
});

router.patch('/:id', checkToken, async (req, res) => {
    const { body, params } = req;
    try {
        const result = await useCases.editTag(params.id, body);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao editar tag');
    }
});

router.delete('/:id', checkToken, async (req, res) => {
    const { params } = req;
    try {
        await useCases.deleteTag(params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar tag');
    }
});

module.exports = router;