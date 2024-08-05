// routes/images.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { checkToken } = require('../middlewares/checkAuth');
const useCases = require('../use-cases/images');
const upload = multer();

router.get('/', async (req, res) => {
    try {
    const images = await useCases.listImages(req.query)

    res.status(200).send(images)
    } catch (err) {
        console.log(err)
        res.status(500).send('Erro ao listar imagens');
    }
});

router.post('/', checkToken, upload.array('files'), async (req, res) => {
    const { files, body } = req;
    try {
        const result = await useCases.uploadImage(files, body);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao enviar imagem');
    }
});

router.patch('/:id', checkToken, async (req, res) => {
    const { body, params } = req;
    try {
        const result = await useCases.editImage(params.id, body);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao editar imagem');
    }
});

router.delete('/:id', checkToken, async (req, res) => {
    const { params } = req;
    try {
        await useCases.deleteImage(params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar imagem');
    }
});

module.exports = router;
