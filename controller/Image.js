const Clarifai = require('clarifai');

const returnClarifaiRequestOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = 'aaf181c3de1849b79571d6377b721216';
  // Since you're making inferences outside your app's scope
  const USER_ID = 'frans070304';       
  const APP_ID = 'face-recognition';
  // Change these to whatever model and image URL you want to use
  // const MODEL_VERSION_ID = '';
  const IMAGE_URL = imageUrl;
  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  
  return requestOptions;
  };


const handleApiCall = (req, res) => {
  fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(req.body.input))
    .then(response => response.text())
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to get outputs' + err));
    };

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db.select('*').from('users').where({id})
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to update entries or find user with id'))
}

module.exports = {
    handleImage,
    handleApiCall
};