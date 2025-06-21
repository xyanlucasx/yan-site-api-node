const s3 = require("../services/S3");
const sharp = require("sharp");
const Image = require("../models/Image");
const Tag = require("../models/Tag");
const {
  getCityStateCountry,
  getTagsAndColors,
} = require("../services/google");
const { setImagesUrl } = require('../helpers/general');


const { getMetadata } = require("../helpers/metadata");

const listImages = async (query) => {
  try {
    let {
      tags,
      country,
      state,
      city,
      sort,
      order,
      offset,
      limit,
      takenAtFrom,
      takenAtTo,
      createdAtFrom,
      createdAtTo,
      id,
      ...metadata
    } = query;

    const filter = {};
    const pagination = {
      offset: parseInt(offset) || 0,
      limit: parseInt(limit) || 10,
    };
    if (tags) filter["tags"] = { $all: tags };
    if (country) filter["country"] = { $in: country };
    if (state) filter["state"] = { $in: state };
    if (city) filter["city"] = { $in: city };
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        filter[`metadata.${key}`] = { $in: value };
      });
    }
    if (takenAtFrom || takenAtTo) {
      filter["metadata.takenAt"] = {};
      if (takenAtFrom) filter["metadata.takenAt"].$gte = takenAtFrom;
      if (takenAtTo) filter["metadata.takenAt"].$lte = takenAtTo;
    }
    if (createdAtFrom || createdAtTo) {
      filter["createdAt"] = {};
      if (createdAtFrom) filter["createdAt"].$gte = new Date(createdAtFrom);
      if (createdAtTo) filter["createdAt"].$lte = new Date(createdAtTo);
    }

    let sortQuery = {};
    if (sort && order) sortQuery[sort] = order === "asc" ? 1 : -1;

    //strategy to use image routes and keep navigation inside modal working
    if (id) {
      const allImages = await Image.find(filter).sort(sortQuery);

      const index = allImages.findIndex((img) => img._id.toString() === id);
      if (index === -1) {
        throw new Error("Image not found");
      }

      pagination.limit = (index < pagination.limit ? pagination.limit : index) + 10;
      pagination.offset = 0;
    }
    const images = await Image.find(filter)
      .sort(sortQuery)
      .skip(pagination.offset)
      .limit(pagination.limit);

    const total = await Image.countDocuments(filter);

    return {
      images: setImagesUrl(images),
      total,
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar imagens" });
  }
};

const uploadImage = async (files, fields) => {
  const uploads = [];
  try {
    const allImages = [];
    const versionNames = fields.versionNames;
    const description = fields.description;

    const metadata = getMetadata(files[0].buffer);

    for (const [index, file] of files.entries()) {
      const { originalname, buffer, mimetype } = file;
      const fileExtension = originalname.split(".").pop();
      const fileName = originalname.split(".").slice(0, -1).join(".");
      const sanitizedUniqueName = fileName.replace(/[^\w\s.-]/gi, "");
      const truncatedUniqueName = sanitizedUniqueName.substring(0, 240);
      const uniqueName = `${Date.now()}-${truncatedUniqueName}`;
      const versionName = versionNames[index];

      if (!metadata.fullSizeWidth || !metadata.fullSizeHeight) {
        throw new Error("Não foi possível obter as dimensões da imagem");
      }

      const lazyThumbnailBase64 = (
        await sharp(buffer)
          .resize(
            Math.round(metadata.fullSizeWidth / 25),
            Math.round(metadata.fullSizeHeight / 25)
          )
          .blur(5)
          .toFormat("webp")
          .toBuffer()
      ).toString("base64");

      const thumbnailName = `${uniqueName}-thumbnail.${fileExtension}`;
      const thumbnailBuffer = await sharp(buffer)
        .resize(metadata.thumbnailWidth, metadata.thumbnailHeight)
        .toBuffer();
      const thumbnailUrl = await s3.uploadImageToS3(
        thumbnailName,
        thumbnailBuffer,
        mimetype
      );
      uploads.push(thumbnailUrl);

      const optimizedName = `${uniqueName}-optimized.${fileExtension}`;
      const optimizedBuffer = await sharp(buffer)
        .resize(metadata.optimizedWidth, metadata.optimizedHeight)
        .toBuffer();
      const optimizedUrl = await s3.uploadImageToS3(
        optimizedName,
        optimizedBuffer,
        mimetype
      );
      uploads.push(optimizedUrl);

      const fullSizeUrl = await s3.uploadImageToS3(
        `${uniqueName}.${fileExtension}`,
        buffer,
        "application/octet-stream"
      );
      uploads.push(fullSizeUrl);

      allImages.push({
        thumbnailUrl,
        optimizedUrl,
        fullSizeUrl,
        versionName,
        lazyThumbnailBase64: `data:image/webp;base64,${lazyThumbnailBase64}`
      });
    }

    const { colors, tags } = await getTagsAndColors([allImages[0].optimizedUrl]);

    allImages.forEach((image, index) => {
      image.colorPalette = colors[index];
    });

    const original = allImages.find(
      (image) => image.versionName.toLowerCase() === "original"
    );
    const images = allImages.filter(
      (image) => image.versionName.toLowerCase() !== "original"
    );

    let country, state, city;

    if (metadata.latitude && metadata.longitude) {
      const location = await getCityStateCountry(
        metadata.latitude,
        metadata.longitude
      );

      country = location.country;
      state = location.state;
      city = location.city;
    }

    const tagsInDB = await Tag.find();
    const tagsInDBNames = tagsInDB.map((tag) => tag.name);

    const image = {
      ...(description && { description }),
      tags: tags?.filter((tag) => tagsInDBNames.includes(tag)),
      country,
      state,
      city,
      images,
      original,
      metadata,
    };

    const newImage = new Image(image);

    await newImage.save();

    const newImageWithCompleteUrl = setImagesUrl([newImage]);

    return newImageWithCompleteUrl[0];
  } catch (err) {
    console.error(err);
    if (uploads.length) {
      const keysS3ToDelete = [];

      uploads.forEach((url) => {
        keysS3ToDelete.push(url);
      });

      await s3.deleteImagesToS3(keysS3ToDelete);
    }

    throw new Error("Erro ao processar imagem");
  }
};

const editImage = async (id, body) => {
  try {
    const image = await Image.findById(id);
    if (!image) {
      throw new Error("Imagem não encontrada");
    }
    const { description, tags, country, state, city, images, original, metadata } = body;
    if (typeof description !== 'undefined') image.description = description;
    if (typeof tags !== 'undefined') image.tags = tags;
    if (typeof country !== 'undefined') image.country = country;
    if (typeof state !== 'undefined') image.state = state;
    if (typeof city !== 'undefined') image.city = city;
    if (typeof images !== 'undefined') {
      image.images = images.map(image => {
        image.fullSizeUrl = image.fullSizeUrl.includes('https://')
          ? image.fullSizeUrl.substring(image.fullSizeUrl.lastIndexOf('/') + 1) : image.fullSizeUrl;
        image.optimizedUrl = image.optimizedUrl.includes('https://')
          ? image.optimizedUrl.substring(image.optimizedUrl.lastIndexOf('/') + 1) : image.optimizedUrl;
        image.thumbnailUrl = image.thumbnailUrl.includes('https://')
          ? image.thumbnailUrl.substring(image.thumbnailUrl.lastIndexOf('/') + 1) : image.thumbnailUrl;
        return image;
      });
    }
    if (typeof original !== 'undefined') {
      image.original.fullSizeUrl = original.fullSizeUrl.includes('https://')
        ? original.fullSizeUrl.substring(original.fullSizeUrl.lastIndexOf('/') + 1) : original.fullSizeUrl;
      image.original.optimizedUrl = original.optimizedUrl.includes('https://')
        ? original.optimizedUrl.substring(original.optimizedUrl.lastIndexOf('/') + 1) : original.optimizedUrl;
      image.original.thumbnailUrl = original.thumbnailUrl.includes('https://')
        ? original.thumbnailUrl.substring(original.thumbnailUrl.lastIndexOf('/') + 1) : original.thumbnailUrl;
    }
    if (typeof metadata.takenAt !== 'undefined') image.metadata.takenAt = metadata.takenAt;

    const updatedImage = await image.save();

    const updatedImageWithCompleteUrl = setImagesUrl([updatedImage]);

    return updatedImageWithCompleteUrl[0];
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao editar imagem");
  }
};

const deleteImage = async (id) => {
  const deletedDocument = await Image.findById(id);

  if (!deletedDocument) {
    throw new Error("Documento não encontrado");
  }

  const keysS3ToDelete = [];

  deletedDocument.images?.forEach((image) => {
    keysS3ToDelete.push(image.fullSizeUrl);
    keysS3ToDelete.push(image.thumbnailUrl);
    keysS3ToDelete.push(image.optimizedUrl);
  });

  if (deletedDocument?.original?._id) {
    keysS3ToDelete.push(deletedDocument.original.fullSizeUrl);
    keysS3ToDelete.push(deletedDocument.original.thumbnailUrl);
    keysS3ToDelete.push(deletedDocument.original.optimizedUrl);
  }

  await s3.deleteImagesToS3(keysS3ToDelete);

  await Image.findByIdAndDelete(id);

  return true;
};

module.exports = {
  uploadImage,
  listImages,
  editImage,
  deleteImage,
};
