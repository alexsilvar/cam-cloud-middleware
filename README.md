# Cam Cloud Middleware
A middleware between a IP Cam and a Microsoft Prediction API

#Setup
Clone the repository and run ```npm install```
Add a .env file containing the following environment variables:
```
CAM_URI=http://192.168.0.101:8080
PORT=3000

COMPUTER_VISION_PREDICTION_KEY=abcdabcsa...
COMPUTER_VISION_ENDPOINT=https://southcentralus.api.cognitive.microsof...
```

run ```node inde.js```

# Usage
- call from any browser ``` / ``` endpoint to peak you camera.
- call from any browser ``` /situation ``` to peak your camera and send to microsoft and receive its response.
