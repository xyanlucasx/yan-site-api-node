const ExifReader = require("exifreader");

function convertDateFormat(dateStr) {
  if(!dateStr) return null
  const [date, hour] = dateStr.split(" ")
  return new Date(`${date.replace(/:/g, '-')}T${hour}`)
}


const iphone12ProMax = (metadataPhoto) => {

    const whiteBalanceEnum = {
    "Auto white balance": "Auto",
    }

    const lensEnum = {
        "iPhone 12 Pro Max back triple camera 1.54mm f/2.4": "Ultra wide",
        "iPhone 12 Pro Max back triple camera 5.1mm f/1.6": "Wide",
        "iPhone 12 Pro Max back triple camera 7.5mm f/2.2": "Telephoto"
    }

    const flashEnum = {
        "Flash did not fire, compulsory flash mode": "Off",
    }

    const camera = 'iPhone 12 Pro Max';
    const lens = lensEnum[metadataPhoto.LensModel?.description];
    const iso = metadataPhoto.ISOSpeedRatings?.value;
    const shutterSpeed = metadataPhoto.ShutterSpeedValue?.description;
    const flash = flashEnum[metadataPhoto.Flash?.description];
    const whiteBalance = whiteBalanceEnum[metadataPhoto.WhiteBalance?.description];
    const aperture = metadataPhoto.ApertureValue?.description;
    const latitude = metadataPhoto.GPSLatitude?.description;
    const longitude = metadataPhoto.GPSLongitude?.description;
    const cameraTrueDirection = metadataPhoto.GPSImgDirection?.description;
    const takenAt = convertDateFormat(metadataPhoto.DateTimeOriginal?.description);
    const fullSizeWidth = metadataPhoto["Image Width"]?.value;
    const fullSizeHeight = metadataPhoto["Image Height"]?.value;
    const optimizedWidth = Math.round(metadataPhoto["Image Width"]?.value / 3);
    const optimizedHeight = Math.round(metadataPhoto["Image Height"]?.value / 3);
    const thumbnailWidth = Math.round(metadataPhoto["Image Width"]?.value / 15);
    const thumbnailHeight = Math.round(metadataPhoto["Image Height"]?.value / 15);

    return {
        camera,
        lens,
        iso,
        shutterSpeed,
        flash,
        whiteBalance,
        aperture,
        latitude,
        longitude,
        cameraTrueDirection,
        takenAt,
        fullSizeWidth,
        fullSizeHeight,
        optimizedWidth,
        optimizedHeight,
        thumbnailWidth,
        thumbnailHeight
    };
}

const pocoX3Pro = (metadataPhoto) => {
    const whiteBalanceEnum = {
        "Auto white balance": "Auto",
    }

    const flashEnum = {
        "Flash did not fire, compulsory flash mode": "Off",
    }

    const lensEnum = {
        1.8: "Wide",
        2.2: "Ultra Wide",
        2.4: "Macro"
    }

    const camera = 'Poco X3 Pro'
    const lens = lensEnum[Number(metadataPhoto.ApertureValue?.description)];
    const iso = metadataPhoto.ISOSpeedRatings?.value;
    const shutterSpeed = metadataPhoto.ShutterSpeedValue?.description;
    const flash = flashEnum[metadataPhoto.Flash?.description];
    const whiteBalance = whiteBalanceEnum[metadataPhoto.WhiteBalance?.description];
    const aperture = metadataPhoto.ApertureValue?.description;
    const latitude = metadataPhoto.GPSLatitude?.description;
    const longitude = metadataPhoto.GPSLongitude?.description;
    const cameraTrueDirection = metadataPhoto.GPSImgDirection?.description;
    const takenAt = convertDateFormat(metadataPhoto.DateTimeOriginal?.description)
    const fullSizeWidth = metadataPhoto["Image Width"]?.value;
    const fullSizeHeight = metadataPhoto["Image Height"]?.value;
    const optimizedWidth = Math.round(metadataPhoto["Image Width"]?.value / 3);
    const optimizedHeight = Math.round(metadataPhoto["Image Height"]?.value / 3);
    const thumbnailWidth = Math.round(metadataPhoto["Image Width"]?.value / 15);
    const thumbnailHeight = Math.round(metadataPhoto["Image Height"]?.value / 15);

    return {
        camera,
        lens,
        iso,
        shutterSpeed,
        flash,
        whiteBalance,
        aperture,
        latitude,
        longitude,
        cameraTrueDirection,
        takenAt,
        fullSizeWidth,
        fullSizeHeight,
        optimizedWidth,
        optimizedHeight,
        thumbnailWidth,
        thumbnailHeight
    };
}

const lumia640 = (metadataPhoto) => {
    const whiteBalanceEnum = {
        "Auto white balance": "Auto",
    }

    const flashEnum = {
        "Flash did not fire": "Off",
    }

    const camera = 'Nokia Lumia 640'
    const lens = 'Wide';
    const iso = metadataPhoto.ISOSpeedRatings?.value;
    const shutterSpeed = metadataPhoto.ShutterSpeedValue?.description;
    const flash = flashEnum[metadataPhoto.Flash?.description];
    const whiteBalance = whiteBalanceEnum[metadataPhoto.WhiteBalance?.description];
    const aperture = metadataPhoto.ApertureValue?.description;
    const latitude = metadataPhoto.GPSLatitude?.description;
    const longitude = metadataPhoto.GPSLongitude?.description;
    const cameraTrueDirection = metadataPhoto.GPSImgDirection?.description;
    const takenAt = convertDateFormat(metadataPhoto.DateTimeOriginal?.description)
    const fullSizeWidth = metadataPhoto["Image Width"]?.value;
    const fullSizeHeight = metadataPhoto["Image Height"]?.value;
    const optimizedWidth = Math.round(metadataPhoto["Image Width"]?.value / 3);
    const optimizedHeight = Math.round(metadataPhoto["Image Height"]?.value / 3);
    const thumbnailWidth = Math.round(metadataPhoto["Image Width"]?.value / 15);
    const thumbnailHeight = Math.round(metadataPhoto["Image Height"]?.value / 15);

    return {
        camera,
        lens,
        iso,
        shutterSpeed,
        flash,
        whiteBalance,
        aperture,
        latitude,
        longitude,
        cameraTrueDirection,
        takenAt,
        fullSizeWidth,
        fullSizeHeight,
        optimizedWidth,
        optimizedHeight,
        thumbnailWidth,
        thumbnailHeight
    };
}


const djiMini2 = (metadataPhoto) => {
    const whiteBalanceEnum = {
        "Auto white balance": "Auto",
    }

    const flashEnum = {
        "Flash did not fire, compulsory flash mode": "Off",
    }

    const latitudeRef = metadataPhoto.GPSLatitudeRef.value[0] === 'S' ? -1 : 1;
    const longitudeRef = metadataPhoto.GPSLongitudeRef.value[0] === 'W' ? -1 : 1;

    const camera = 'DJI Mini 2'
    const lens = '24mm'
    const iso = metadataPhoto.ISOSpeedRatings?.value;
    const shutterSpeed = metadataPhoto.ShutterSpeedValue?.description;
    const flash = "Off";
    const whiteBalance = whiteBalanceEnum[metadataPhoto.WhiteBalance?.description];
    const aperture = metadataPhoto.ApertureValue?.description;
    const latitude = metadataPhoto.GPSLatitude?.description * latitudeRef;
    const longitude = metadataPhoto.GPSLongitude?.description * longitudeRef;
    const cameraTrueDirection = metadataPhoto.GPSImgDirection?.description;
    const takenAt = convertDateFormat(metadataPhoto.DateTimeOriginal?.description)
    const fullSizeWidth = metadataPhoto["Image Width"]?.value;
    const fullSizeHeight = metadataPhoto["Image Height"]?.value;
    const optimizedWidth = Math.round(metadataPhoto["Image Width"]?.value / 3);
    const optimizedHeight = Math.round(metadataPhoto["Image Height"]?.value / 3);
    const thumbnailWidth = Math.round(metadataPhoto["Image Width"]?.value / 15);
    const thumbnailHeight = Math.round(metadataPhoto["Image Height"]?.value / 15);

    return {
        camera,
        lens,
        iso,
        shutterSpeed,
        flash,
        whiteBalance,
        aperture,
        latitude,
        longitude,
        cameraTrueDirection,
        takenAt,
        fullSizeWidth,
        fullSizeHeight,
        optimizedWidth,
        optimizedHeight,
        thumbnailWidth,
        thumbnailHeight
    };
}

const hero9Black = (metadataPhoto) => {
    const whiteBalanceEnum = {
        "Auto white balance": "Auto",
    }

    const flashEnum = {
        "Flash did not fire, compulsory flash mode": "Off",
    }

    const camera = 'Go Pro Hero 9 Black'
    const lens = '16mm'
    const iso = metadataPhoto.ISOSpeedRatings?.value;
    const shutterSpeed = metadataPhoto.ShutterSpeedValue?.description;
    const flash = "Off";
    const whiteBalance = whiteBalanceEnum[metadataPhoto.WhiteBalance?.description];
    const aperture = metadataPhoto.ApertureValue?.description;
    const latitude = metadataPhoto.GPSLatitude?.description;
    const longitude = metadataPhoto.GPSLongitude?.description;
    const cameraTrueDirection = metadataPhoto.GPSImgDirection?.description;
    const takenAt = convertDateFormat(metadataPhoto.DateTimeOriginal?.description)
    const fullSizeWidth = metadataPhoto["Image Width"]?.value;
    const fullSizeHeight = metadataPhoto["Image Height"]?.value;
    const optimizedWidth = Math.round(metadataPhoto["Image Width"]?.value / 3);
    const optimizedHeight = Math.round(metadataPhoto["Image Height"]?.value / 3);
    const thumbnailWidth = Math.round(metadataPhoto["Image Width"]?.value / 15);
    const thumbnailHeight = Math.round(metadataPhoto["Image Height"]?.value / 15);

    return {
        camera,
        lens,
        iso,
        shutterSpeed,
        flash,
        whiteBalance,
        aperture,
        latitude,
        longitude,
        cameraTrueDirection,
        takenAt,
        fullSizeWidth,
        fullSizeHeight,
        optimizedWidth,
        optimizedHeight,
        thumbnailWidth,
        thumbnailHeight
    };
}

const sonyZvE10 = (metadataPhoto) => {
    const whiteBalanceEnum = {
        "Auto white balance": "Auto",
    }

    const flashEnum = {
        "Flash did not fire, compulsory flash mode": "Off",
    }

    const camera = 'Sony ZV-E10'
    const lens = metadataPhoto.LensModel?.description;
    const iso = metadataPhoto.ISOSpeedRatings?.value;
    const shutterSpeed = metadataPhoto.ShutterSpeedValue?.description;
    const flash = "Off";
    const whiteBalance = whiteBalanceEnum[metadataPhoto.WhiteBalance?.description];
    const aperture = metadataPhoto.ApertureValue?.description;
    const latitude = metadataPhoto.GPSLatitude?.description;
    const longitude = metadataPhoto.GPSLongitude?.description;
    const cameraTrueDirection = metadataPhoto.GPSImgDirection?.description;
    const takenAt = convertDateFormat(metadataPhoto.DateTimeOriginal?.description)
    const fullSizeWidth = metadataPhoto["Image Width"]?.value;
    const fullSizeHeight = metadataPhoto["Image Height"]?.value;
    const optimizedWidth = Math.round(metadataPhoto["Image Width"]?.value / 3);
    const optimizedHeight = Math.round(metadataPhoto["Image Height"]?.value / 3);
    const thumbnailWidth = Math.round(metadataPhoto["Image Width"]?.value / 15);
    const thumbnailHeight = Math.round(metadataPhoto["Image Height"]?.value / 15);

    return {
        camera,
        lens,
        iso,
        shutterSpeed,
        flash,
        whiteBalance,
        aperture,
        latitude,
        longitude,
        cameraTrueDirection,
        takenAt,
        fullSizeWidth,
        fullSizeHeight,
        optimizedWidth,
        optimizedHeight,
        thumbnailWidth,
        thumbnailHeight
    };
}

const getByModel = (model, metadataPhoto) => {
    const models = {
        "iPhone 12 Pro Max": iphone12ProMax,
        "M2102J20SG": pocoX3Pro,
        "FC7303": djiMini2,
        "HERO9 Black": hero9Black,
        "ZV-E10": sonyZvE10,
        "--": pocoX3Pro,
        "RM-1109": lumia640

    }

    const funcToGet = models[model];

    if (!funcToGet) {
        throw new Error('Modelo de câmera não suportado');
    }

    return funcToGet(metadataPhoto);
}

const getMetadata = (buffer) => {
    const metadataPhoto = ExifReader.load(buffer);
    const camera = metadataPhoto.Model?.description;
    if (!camera) {
        throw new Error('Modelo de câmera não encontrado');
    }
    return getByModel(camera, metadataPhoto);
}

module.exports = {
    getMetadata
};