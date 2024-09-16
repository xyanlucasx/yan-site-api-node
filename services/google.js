const axios = require("axios");
const util = require("util");

// Função para obter informações de cidade, estado e país a partir de latitude e longitude
const getCityStateCountry = async (latitude, longitude) => {
  try {
    const apiKey = process.env.GOOGLEAPIKEY;

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    console.log("location", `${latitude} , ${longitude}`);
    console.log(
      util.inspect(response.data, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
    if (response.status === 200) {
      const result = response.data;

      if (result.results && result.results.length > 0) {
        const addressComponents = result.results[0].address_components;
        let city, state, country;

        addressComponents.forEach((component) => {
          if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_2")
          ) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        });

        return { city, state, country };
      } else {
        throw new Error("Nenhum resultado encontrado");
      }
    } else {
      throw new Error("Falha na solicitação para a API do Google Maps");
    }
  } catch (error) {
    throw new Error(
      `Erro ao obter informações de cidade, estado e país: ${error.message}`
    );
  }
};

const getTagsAndColors = async (imagesUrls) => {
  try {
    const requestData = {
      requests: imagesUrls.map((imageUrl, index) => {
        const payload = {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [{ type: "IMAGE_PROPERTIES", maxResults: 5 }],
        };

        if (index === 0) {
          payload.features.push({ type: "LABEL_DETECTION", maxResults: 50 });
        }

        return payload;
      }),
    };

    const response = await axios.post(
      "https://vision.googleapis.com/v1/images:annotate",
      requestData,
      {
        params: { key: process.env.GOOGLEAPIKEY },
      }
    );

    console.log("colorsAndTags", JSON.stringify(imagesUrls));
    console.log(
      util.inspect(response.data, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
    const tags = response.data.responses[0].labelAnnotations.map(
      (annotation) => annotation.description
    );
    const colors = response.data.responses.map((response) =>
      response.imagePropertiesAnnotation.dominantColors.colors.map((color) => {
        return {
          ...color.color,
          score: color.score,
          pixelFraction: color.pixelFraction,
        };
      })
    );

    return { tags, colors };
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    throw error;
  }
};

module.exports = {
  getCityStateCountry,
  getTagsAndColors,
};
