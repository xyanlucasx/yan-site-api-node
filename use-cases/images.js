const s3 = require("../services/S3");
const sharp = require("sharp");
const Image = require("../models/Image");
const {
  getCityStateCountry,
  getClassificationTags,
  getColors,
} = require("../services/google");

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
      limit: parseInt(limit) || 10
    }
    if (tags) filter["tags"] = { $in: tags };
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
      const allImages = await Image.find(filter)
        .sort(sortQuery)

      const index = allImages.findIndex(img => img._id.toString() === id);
      if (index === -1) {
        throw new Error("Image not found");
      }
      pagination.limit = index + 10;
      pagination.offset = 0
    }

    const images = await Image.find(filter)
      .sort(sortQuery)
      .skip(pagination.offset)
      .limit(pagination.limit);

    const total = await Image.countDocuments(filter);

    return {
      images: images.map((i) => {
        i.description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum felis justo, vulputate eu semper eget,
            euismod in libero. Nam at neque vel odio scelerisque egestas. Maecenas porttitor molestie dui,
            in dignissim tellus lacinia ac. Aliquam suscipit tellus quis justo bibendum, congue pellentesque metus tristique.
            Maecenas ut cursus enim. Duis suscipit mi mi, sed dapibus libero tincidunt at. Praesent et enim et eros fringilla imperdiet.
            Nunc egestas in turpis at venenatis.
            Maecenas maximus orci sed placerat placerat. Donec nunc massa, tempus vitae odio a, molestie scelerisque nisi.
            Vivamus porta risus eget ornare dapibus. Curabitur dignissim suscipit orci, a rutrum nisl egestas eget.
            Nam tristique, magna vitae commodo mattis, ante nunc sodales sem, euismod vehicula sem lacus a ante.
            Nulla euismod est risus, eu mollis risus tempor in. Curabitur nibh odio, interdum id est nec, auctor venenatis ex.
            Sed vel purus ut massa elementum lacinia.
            Quisque varius erat at tortor tempus finibus. Suspendisse finibus diam in viverra accumsan.
            Sed rhoncus maximus urna faucibus pharetra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Duis quis sem mauris. Vestibulum a maximus neque. Phasellus facilisis, est eu iaculis cursus, ipsum
            lectus viverra orci, sed ultricies est nunc ut sapien. Aliquam laoreet ut elit quis sagittis. Integer posuere non nulla
            eget hendrerit. Praesent molestie sodales auctor. Nam quis orci vel mauris commodo mattis. Vivamus aliquam porta euismod.
            Integer tempus purus nec justo ultricies molestie.
            Nullam dapibus, eros id vehicula condimentum, elit nibh fermentum urna, id ornare massa massa eget nisi.
            Nullam eu sagittis purus, et viverra lectus. Praesent id lacus et enim pharetra euismod vel nec risus. Duis sit amet
            eleifend augue. Praesent semper lorem ac varius congue. Suspendisse vel elit vel tellus laoreet consequat lobortis id metus.
            In hac habitasse platea dictumst. Aliquam erat volutpat. Donec vel metus nisi. Praesent mauris nunc,
            luctus vel efficitur eu, sagittis et felis. Aliquam erat volutpat.
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris dolor ligula,
            condimentum ut vehicula sed, tristique sit amet velit. Ut ullamcorper ut mauris id semper.
            Pellentesque eleifend velit vitae massa hendrerit ornare. Pellentesque nisi nunc, maximus in orci nec, eleifend tempor nulla.
            Ut euismod non nisl vitae placerat. Sed justo nisi, scelerisque eget orci non, pulvinar congue arcu. Sed luctus metus sed
            massa dapibus, quis dapibus enim ultricies.`;
        return i;
      }),
      total,
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar imagens" });
  }
};

const uploadImage = async (files, fields) => {
  const uploads = []
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
      uploads.push(thumbnailUrl)

      const optimizedName = `${uniqueName}-optimized.${fileExtension}`;
      const optimizedBuffer = await sharp(buffer)
        .resize(metadata.optimizedWidth, metadata.optimizedHeight)
        .toBuffer();
      const optimizedUrl = await s3.uploadImageToS3(
        optimizedName,
        optimizedBuffer,
        mimetype
      );
      uploads.push(optimizedUrl)

      const fullSizeUrl = await s3.uploadImageToS3(
        `${uniqueName}.${fileExtension}`,
        buffer,
        "application/octet-stream"
      );
      uploads.push(fullSizeUrl)

      const colorPalette = await getColors(fullSizeUrl);

      allImages.push({
        thumbnailUrl,
        optimizedUrl,
        fullSizeUrl,
        versionName,
        lazyThumbnailBase64: `data:image/webp;base64,${lazyThumbnailBase64}`,
        colorPalette,
      });
    }

    const original = allImages.find(
      (image) => image.versionName.toLowerCase() === "original"
    );
    const images = allImages.filter(
      (image) => image.versionName.toLowerCase() !== "original"
    );

    let country, state, city

    if (metadata.latitude && metadata.longitude) {
    const location = await getCityStateCountry(
      metadata.latitude,
      metadata.longitude
    );

    country = location.country;
    state = location.state;
    city = location.city;
    }

    const tags = await getClassificationTags(
      original ? original.fullSizeUrl : images[0].fullSizeUrl
    );
    const image = {
      ...(description && { description }),
      tags,
      country,
      state,
      city,
      images,
      original,
      metadata,
    };

    const newImage = new Image(image);

    await newImage.save();

    return newImage;
  } catch (err) {
    console.error(err);
    if(uploads.length) {
      const keysS3ToDelete = [];

      uploads.forEach((url) => {
        const urlObj = new URL(url);
        const key = urlObj.pathname.substring(1);
        keysS3ToDelete.push(key);
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
    const { description, tags, country, state, city, images, original } = body;
    if (description) image.description = description;
    if (tags) image.tags = tags;
    if (country) image.country = country;
    if (state) image.state = state;
    if (city) image.city = city;
    if (images) image.images = images;
    if (original) image.original = original;

    const updatedImage = await image.save();

    return updatedImage;
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao editar imagem");
  }
};

const deleteImage = async (id) => {
  const deletedDocument = await Image.findByIdAndDelete(id);

  if (!deletedDocument) {
    throw new Error("Documento não encontrado");
  }

  const keysS3ToDelete = [];

  deletedDocument.images.forEach((image) => {
    const urlFullSize = new URL(image.fullSizeUrl);
    const keyFullSize = urlFullSize.pathname.substring(1);
    keysS3ToDelete.push(keyFullSize);
    const urlThumbnail = new URL(image.thumbnailUrl);
    const keyThumbnail = urlThumbnail.pathname.substring(1);
    keysS3ToDelete.push(keyThumbnail);
    const urlOptimized = new URL(image.optimizedUrl);
    const keyOptimized = urlOptimized.pathname.substring(1);
    keysS3ToDelete.push(keyOptimized);
  });

  await s3.deleteImagesToS3(keysS3ToDelete);

  return true;
};

module.exports = {
  uploadImage,
  listImages,
  editImage,
  deleteImage,
};
