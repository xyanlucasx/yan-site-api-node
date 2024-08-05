
const Country = require("../models/Country");


const listCountries = async () => {
    try {
    const countries  = await Country.find().sort({ name: 1 });
    return countries
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar países" });
  }
};

const uploadCountry = async (payload) => {
  try {
    const country = {
      name: payload.name,
      code: payload.code
    };

    const newCountry = new Country(country);

    await newCountry.save();

    return newCountry;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao cadastrar país");
  }
};

const editCountry = async (id, body) => {
  try {
    const country = await Country.findById(id);

    if (!country) {
        throw new Error("País não encontrado");
    }

    country.name = body.name;
    country.code = body.code;

    const updatedCountry = await country.save();

    return updatedCountry;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao editar imagem");
  }
};

const deleteCountry = async (id) => {
  const deletedDocument = await Country.findByIdAndDelete(id);

  if (!deletedDocument) {
    throw new Error("País não encontrado");
  }

  return true;
};

module.exports = {
  uploadCountry,
  listCountries,
  editCountry,
  deleteCountry,
};
