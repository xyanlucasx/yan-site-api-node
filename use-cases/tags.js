const Tag = require("../models/Tag");

const listTags = async () => {
    try {
        const tags = await Tag.find().sort({ name: 1 });
        return tags
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar tags" });
    }
}

const uploadTag = async (payload) => {
    try {
        const tag = {
            name: payload.name,
            code: payload.code
        };

        const newTag = new Tag(tag);

        await newTag.save();

        return newTag;
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao cadastrar tags");
    }
};

const editTag = async (id, body) => {
    try {
        const tag = await Tag.findById(id);

        if (!tag) {
            throw new Error("Tag não encontrada");
        }

        tag.name = body.name;
        tag.code = body.code;

        const updatedTag = await tag.save();

        return updatedTag;
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao editar tag");
    }
};

const deleteTag = async (id) => {
    const deletedDocument = await Tag.findByIdAndDelete(id);

    if (!deletedDocument) {
        throw new Error("Tag não encontrado");
    }

    return true;
};

module.exports = {
    listTags,
    uploadTag,
    editTag,
    deleteTag
};
