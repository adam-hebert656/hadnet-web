const router = require('express').Router();
const { db } = require('../../database/index');
const { 
  addReview,
  getUserById,
  getReviewsByBusiness,
} = require('../../database/helpers')

//const { reviews } = require('../../database/mock-reviews');

router.get('/business/:id', (req, res) => {
  const id = req.params.id;
  getReviewsByBusiness(id)
    .then((reviews) => {
      res.send(reviews);
    }).catch((err) => {
      res.sendStatus(404);
    });
  
});

router.get('/user/:id', (req,res) => {
  const userId = parseInt(req.params.id);

  /****************TODO****************
   * get reviews for specific user
   */
  console.log(`Grabbing all reviews for user id: ${userId}`);
  const userReviews = reviews.filter((review) => {
    return (review.idUser === userId);
  })
  res.send(userReviews);
})

router.post('/', (req, res) => {
  console.log('hit');
  const review = req.body;
  const { idUser } = review;
  getUserById(idUser)
    .then((user) => {
      const reviewObj = {
        text: review.text,
        ratingNumber: review.ratingNumber,
        idBusiness: review.idBusiness,
        idUser: user.id,
      };
      addReview(reviewObj)
        .then((result) => {
          console.log('review added to db')
          res.send('entered into db');
        });
    });

  /****************TODO****************
   * add review to specified business
   */

});



module.exports = router;
