require('dotenv').config();
const axios = require('axios').default;
const app = require('express')();
const argv = require('yargs').argv;

const cognitive = require('./cognitive');

const getFrame = (camURI) => {
    return axios.get(camURI + '/shot.jpg', { responseType: 'arraybuffer' });
}

const PORT = argv.PORT || process.env.PORT;
const CAM_URI = argv.CAM_URI || process.env.CAM_URI;




app.get('/', (req, res) => {
    getFrame(CAM_URI).then(response => {
        // console.log('success');
        res.set('Content-Type', 'image/jpg')
        res.send(Buffer.from(response.data));
    }).catch(err => {
        // console.log('Erro');
        res.status(400).send(err);
    });
});

app.get('/situation', (req, res) => {
    setTimeout(() => {
        getFrame(CAM_URI).then(response => {
            let img = Buffer.from(response.data);
            console.log(img)
            return cognitive.analyseImage(img)
                .then(msResult => {
                    console.log(msResult.data);
                    res.status(200).send(msResult.data);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err);
                });
        }).catch(err => {
            // console.log('Erro');
            res.status(400).send(err);
        });
    }, 5000);
});

app.get('/situationImage', (req, res) => {
    setTimeout(() => {
        getFrame(CAM_URI).then(response => {
            let img = Buffer.from(response.data);
            return cognitive.analyseImage(img)
                .then(msResult => {
                    cognitive.drawOver(img, msResult.data['predictions'], (err, newImage) => {
                        if (err) {
                            res.status(500).send({ msg: 'Erro ao processar imagem', erro: err });
                        } else {
                            res.set('Content-Type', 'image/jpg');
                            res.send(Buffer.from(newImage));
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err);
                });
        }).catch(err => {
            // console.log('Erro');
            res.status(400).send(err);
        });
    }, 5000);
});

if (PORT && CAM_URI) {
    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
        console.log('PORT:' + PORT);
        console.log('CAM_URI:' + CAM_URI);
    });
} else {
    console.log('Inform PORT and CAM_URI in .env file or pass as parameters');
}



