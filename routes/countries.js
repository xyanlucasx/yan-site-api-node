// routes/countries.js

const express = require("express");
const router = express.Router();
const { checkToken } = require('../middlewares/checkAuth');
const useCases = require("../use-cases/countries.js");

router.get("/", async (req, res) => {
  try {
    const countries = await useCases.listCountries();

    res.status(200).send(countries);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao listar países");
  }
});

router.post("/", checkToken, async (req, res) => {
  const { body } = req;
  try {
    const result = await useCases.uploadCountry(body);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao enviar país");
  }
});

router.patch("/:id", checkToken, async (req, res) => {
  const { body, params } = req;
  try {
    const result = await useCases.editCountry(params.id, body);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao editar país");
  }
});

router.delete("/:id", checkToken, async (req, res) => {
  const { params } = req;
  try {
    await useCases.deleteCountry(params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar país");
  }
});

module.exports = router;
