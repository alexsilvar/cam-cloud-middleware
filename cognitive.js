'use strict';

const axios = require('axios').default;

const { createCanvas, loadImage, Image } = require('canvas');


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

const drawOver = (image, predictions, callback) => {
    const img = new Image()
    img.onload = () => {
        try {
            let canvas = createCanvas(img.width, img.height);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            if (Array.isArray(predictions)) {
                let mostLike = predictions.filter(prediction => prediction['probability'] > 0.5);
                if (mostLike.length == 0)
                    mostLike = predictions.filter(prediction => prediction['probability'] > 0.4);
                console.log(mostLike);
                mostLike.forEach(coords => {
                    let x = coords['boundingBox']["left"] * img.width;
                    let y = coords['boundingBox']["top"] * img.height;
                    let w = coords['boundingBox']["width"] * img.width;
                    let h = coords['boundingBox']["height"] * img.height;
                    console.log(x, y - 30, w, h);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 5;
                    ctx.strokeRect(x, y, w, h);
                });
                let imgBuff = canvas.toBuffer();
                callback(undefined, imgBuff);
            } else {
                console.log('Not A array');
                callback(new Error('No predictions provided as array'), null);
            }
        } catch (err) {
            console.log(err);
            callback(err);
        }
    }
    img.onerror = err => { throw err }
    img.src = image;
}

module.exports = {
    analyseImage,
    drawOver
}