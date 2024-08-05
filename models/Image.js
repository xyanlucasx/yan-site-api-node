const mongoose = require('mongoose');

const colorPaletteSchema = new mongoose.Schema({
    red: { type: Number, required: true },
    green: { type: Number, required: true },
    blue: { type: Number, required: true },
    score: { type: Number, required: true },
    pixelFraction: { type: Number, required: true }
});

const imagesSchema = new mongoose.Schema({
    lazyThumbnailBase64: { type: String, required: true},
    thumbnailUrl: { type: String, required: true },
    optimizedUrl: { type: String, required: true },
    fullSizeUrl: { type: String, required: true },
    versionName: { type: String },
    colorPalette: [colorPaletteSchema],
});

const imageSchema = new mongoose.Schema({
    description: { type: String },
    tags: [{ type: String }],
    country: { type: String },
    state: { type: String },
    city: { type: String },
    images: [imagesSchema],
    original: imagesSchema,
    metadata: {
        camera: { type: String, required: false },
        lens: { type: String, required: false },
        iso: { type: String, required: false },
        shutterSpeed: { type: String, required: false },
        flash: { type: String, required: false },
        whiteBalance: { type: String, required: true },
        aperture: { type: String, required: false },
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false },
        cameraTrueDirection: { type: Number, required: false },
        takenAt: { type: Date, required: false },
        fullSizeWidth: { type: Number, required: true },
        fullSizeHeight: { type: Number, required: true },
        optimizedWidth: { type: Number, required: true },
        optimizedHeight: { type: Number, required: true },
        thumbnailWidth: { type: Number, required: true },
        thumbnailHeight: { type: Number, required: true }
    }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
