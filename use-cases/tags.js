const Tag = require("../models/Tag");
const Image = require("../models/Image");

const listTags = async () => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    return tags;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar tags" });
  }
};

const uploadTag = async (payload) => {
  try {
    const tag = {
      name: payload.name,
      code: payload.code,
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

const sync = async () => {
  try {
    const tags = await Tag.find();

    const tagsInDB = tags.map((tag) => tag.name);

    const imagesWithTags = await Image.find({}, { tags: 1, _id: 1 });

    const newImageTags = imagesWithTags.map((img) => {
      return {
        _id: img._id,
        tags: img.tags.filter((tag) => tagsInDB.includes(tag)),
      };
    });

    await Promise.all(newImageTags.map((imgTag) =>
        Image.updateOne({ _id: imgTag._id }, { $set: { tags: imgTag.tags } })
      ));

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao sincronizar tags");
  }
};

module.exports = {
  listTags,
  uploadTag,
  editTag,
  deleteTag,
  sync,
};
