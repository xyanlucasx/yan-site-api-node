const State = require("../models/State");

const listStates = async () => {
    try {
        const states = await State.find().sort({ name: 1 });
        return states
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar estados" });
    }
}

const uploadState = async (payload) => {
    try {
        const state = {
            name: payload.name,
            code: payload.code,
            countryParentCode: payload.countryParentCode
        };

        const newState = new State(state);

        await newState.save();

        return newState;
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao cadastrar estado");
    }
};

const editState = async (id, body) => {
    try {
        const state = await State.findById(id);

        if (!state) {
            throw new Error("Estado não encontrado");
        }

        state.name = body.name;
        state.code = body.code;
        state.countryParentCode = body.countryParentCode;

        const updatedState = await state.save();

        return updatedState;
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao editar estado");
    }
};

const deleteState = async (id) => {
    const deletedDocument = await State.findByIdAndDelete(id);

    if (!deletedDocument) {
        throw new Error("Estado não encontrado");
    }

    return true;
};

module.exports = {
    listStates,
    uploadState,
    editState,
    deleteState
};
