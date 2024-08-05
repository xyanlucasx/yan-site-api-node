const express = require('express');
const router = express.Router();
const { checkToken } = require('../middlewares/checkAuth');
const useCases = require('../use-cases/cities.js');


router.get('/', async (req, res) => {
    try {
    const cities = await useCases.listCities()

    res.status(200).send(cities)
    } catch (err) {
        console.log(err)
        res.status(500).send('Erro ao listar cidades');
    }
}
);

router.post('/', checkToken, async (req, res) => {
    const { body } = req;
    try {
        const result = await useCases.uploadCity(body);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao enviar cidade');
    }
});

router.patch('/:id', checkToken, async (req, res) => {
    const { body, params } = req;
    try {
        const result = await useCases.editCity(params.id, body);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao editar cidade');
    }
});

router.delete('/:id', checkToken, async (req, res) => {
    const { params } = req;
    try {
        await useCases.deleteCity(params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar cidade');
    }
});

module.exports = router;

