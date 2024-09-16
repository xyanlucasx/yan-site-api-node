const axios = require('axios');

// Função para obter informações de cidade, estado e país a partir de latitude e longitude
const getCityStateCountry = async (latitude, longitude) => {
    try {
        const apiKey = process.env.GOOGLEAPIKEY;

        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        console.log('location', `${latitude} , ${longitude}`)
        console.log('location', response)

        if (response.status === 200) {
            const result = response.data;

            if (result.results && result.results.length > 0) {
                const addressComponents = result.results[0].address_components;
                let city, state, country;

                addressComponents.forEach(component => {
                    if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                        city = component.long_name;
                    } else if (component.types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    } else if (component.types.includes('country')) {
                        country = component.long_name;
                    }
                });

                return { city, state, country };
            } else {
                throw new Error('Nenhum resultado encontrado');
            }
        } else {
            throw new Error('Falha na solicitação para a API do Google Maps');
        }
    } catch (error) {
        throw new Error(`Erro ao obter informações de cidade, estado e país: ${error.message}`);
    }
}

const getClassificationTags = async (imageUrl) => {
    try {
        const requestData = {
            requests: [{
                image: {
                    source: {
                        imageUri: imageUrl
                    }
                },
                features: [{ type: 'LABEL_DETECTION', maxResults: 50 }]
            }]
        };

        const response = await axios.post('https://vision.googleapis.com/v1/images:annotate', requestData, {
            params: { key: process.env.GOOGLEAPIKEY }
        });

        console.log("tags", imageUrl)
        console.log("tags", response)
        const tags = response.data.responses[0].labelAnnotations.map(annotation => annotation.description);

        return tags;
    } catch (error) {
        console.error('Erro ao buscar tags:', error);
        throw error;
    }
};

const getColors = async (imageUrl) => {
    try {
        const requestData = {
            requests: [{
                image: {
                    source: {
                        imageUri: imageUrl
                    }
                },
                features: [{ type: "IMAGE_PROPERTIES", maxResults: 5 }]
            }]
        };

        const response = await axios.post('https://vision.googleapis.com/v1/images:annotate', requestData, {
            params: { key: process.env.GOOGLEAPIKEY }
        });

        console.log("colors", imageUrl)
        console.log("colors", response)
        const collors = response.data.responses[0].imagePropertiesAnnotation.dominantColors.colors;

        return collors.map(color => { return { ...color.color, score: color.score, pixelFraction: color.pixelFraction }});
    } catch (error) {
        console.error('Erro ao buscar tags:', error);
        throw error;
    }
}

module.exports = {
    getCityStateCountry,
    getClassificationTags,
    getColors
};