const City = require("../models/City");

const listCities = async () => {
    try {
        const cities = await City.find().sort({ name: 1 });
        return cities
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar cidades" });
    }
}

const uploadCity = async (payload) => {
    try {
        const city = {
            name: payload.name,
            code: payload.code,
            stateParentCode: payload.stateParentCode,
            countryParentCode: payload.countryParentCode
        };

        const newCity = new City(city);

        await newCity.save();

        return newCity;
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao cadastrar cidade");
    }
};

const editCity = async (id, body) => {
    try {
        const city = await City.findById(id);

        if (!city) {
            throw new Error("Cidade não encontrada");
        }

        city.name = body.name;
        city.code = body.code;
        city.stateParentCode = body.stateParentCode;
        city.countryParentCode = body.countryParentCode;

        const updatedCity = await city.save();

        return updatedCity;
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao editar cidade");
    }
};

const deleteCity = async (id) => {
    const deletedDocument = await City.findByIdAndDelete(id);

    if (!deletedDocument) {
        throw new Error("Cidade não encontrado");
    }

    return true;
};

module.exports = {
    listCities,
    uploadCity,
    editCity,
    deleteCity,
};
