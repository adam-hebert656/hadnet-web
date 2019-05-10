require('dotenv').config();
const router = require('express').Router();
const axios = require('axios');
const { getAllBusinessesFromText, getAllBusinesses, getBusinessByUser, setBusinessOwner, getUserById, getBusinessByFirebaseId } = require('../../database/helpers');
require('dotenv').config();
// mock data
const { businesses } = require('../../database/mock-business-data');


// gets all businesses
router.get('/', (req, res) => {
  console.log('Grabbing all businesses');
  getAllBusinesses()
    .then((results) => {
      res.send(results);
    });
  /** **************TODO****************
   * get all businesses from database
  */
  // res.send(businesses);
});

router.get('/userid/:id', (req, res) => {
  const userId = req.params.id;
  getBusinessByUser(userId)
    .then(results => res.send(results));
});

router.get('/firebaseId/:uid', (req, res) => {
  const { uid } = req.params;
  getBusinessByFirebaseId(uid)
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.error(error);
    });
});


// gets business at specified id
router.get('/:id', (req, res) => {
  const id = req.params.id - 1;

  /** **************TODO****************
   * get business by id from database
   */
  if (businesses[id]) {
    console.log(`Grabbing business at id: ${id}`);
    res.send(businesses[id]);
  } else {
    res.sendStatus(404);
  }
});

router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  console.log(query);
  let origArray;
  let uppArray;
  let lowArray;
  let capArray;
  let decapArray;
  let queryArray;
  if (query.includes(' ')) {
    origArray = query.split(' ').map((queryWord) => {
      return `%${queryWord}%`;
    });
    origArray.push(`%${query}%`);

    uppArray = query.split(' ').map((uppWord) => {
      return `%${uppWord.toUpperCase()}%`;
    });
    uppArray.push(`%${query.toUpperCase()}%`);

    capArray = query.split(' ').map((capWord) => {
      return `%${capWord.charAt(0).toUpperCase()}${capWord.slice(1)}%`;
    });
    capArray.push(`%${query.charAt(0).toUpperCase()}${query.slice(1)}%`);

    decapArray = query.split(' ').map((decapWord) => {
      return `%${decapWord.charAt(0)}${decapWord.slice(1).toLowerCase()}%`;
    });
    decapArray.push(`%${query.charAt(0)}${query.slice(1).toLowerCase()}%`);

    lowArray = query.split(' ').map((lowWord) => {
      return `%${lowWord.toLowerCase()}%`;
    });
    lowArray.push(`%${query.toLowerCase()}%`);
    queryArray = origArray.concat(uppArray).concat(lowArray).concat(capArray).concat(decapArray);
  } else {
    queryArray = [`%${query}%`];
    queryArray.push(`%${query.toLowerCase()}%`);
    queryArray.push(`%${query.toUpperCase()}%`);
    queryArray.push(`%${query.charAt(0).toUpperCase()}${query.slice(1)}%`);
    queryArray.push(`%${query.charAt(0)}${query.slice(1).toLowerCase()}%`);
  }
  getAllBusinessesFromText(queryArray)
    .then((businessesArray) => {
      res.send(businessesArray);
      console.log(businessesArray);
    })
    .catch((error) => {
      res.send('no matches founc');
      console.error(error);
    })
})

// adds business
router.post('/', (req, res) => {
  const business = req.body;
  console.log(`added business: ${business.name} to db`);

  /** **************TODO****************
   * add business to database
   */
  res.send(`added business: ${business.name} to db`);
});


// update business at specific id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id, 10);
  const { uid } = req.body;
  getUserById(uid)
    .then(result => setBusinessOwner(result.id, idNum))
    .then(() => res.sendStatus(201));
});

// verifies a business by checking if image data name matches any buisness name in the table
router.post('/isVerfied', (req, res) => {
  axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_IMAGE_VERIFY_KEY}`, {
    requests: [
      {
        image: {
          content: req.body.img,
        },
        features: [
          {
            type: 'DOCUMENT_TEXT_DETECTION',
            maxResults: 5,
          },
        ],
      },
    ],
  }).then((result) => {
    // array of pieces of text that have been captured in picture
    // const readText = result.data.responses[0].textAnnotations[0].description.replace(/\n/g, ' ').split(' ');
    let x = result.data.responses[0].textAnnotations[0].description.replace(/\n/g, ' ').split(' ');
    if (Array.isArray(x)) {
      x = x.map((query) => {
        return `%${query}%`;
      });
    } else if (x) {
      x = `%${x}%`;
    }
    x.pop();
    return getAllBusinessesFromText(x)
      .then(business => res.send(business))
      .catch((error) => {
        res.send('failure to verify, or text was misinterpreted, line 102 businesses.js server');
      });
  });
});


module.exports = router;
