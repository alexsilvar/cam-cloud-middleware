'use strict';

const axios = require('axios').default;

let predictionKey = process.env['COMPUTER_VISION_PREDICTION_KEY'];
let endpoint = process.env['COMPUTER_VISION_ENDPOINT']
if (!predictionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

var uriBase = endpoint;

const analyseImage = (image) => {
    return axios.post(uriBase, image, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Prediction-Key': predictionKey
        }
    });
}

module.exports = {
    analyseImage
}