const { Op } = require('sequelize');
const {
  User,
  BusinessType,
  ListingType,
  Business,
  CommunityListing,
  Review,
  Image,
} = require('./index.js');


// Add business to database
const addBusiness = businessObj => Business.create(businessObj)
  .then((result) => {
    console.log('entered business into db');
    return result;
  })
  .catch((err) => {
    console.log(err);
  });


// Get all businesses
const getAllBusinesses = () => Business.findAll()
  .then(results => results)
  .catch((err) => {
    console.log(err);
  });

const getAllBusinessesFromText = (queryArray) => {
  console.log(queryArray);
  return Business.findAll({
    where: {
      name: {
        [Op.like]: {
          [Op.any]: queryArray,
        },
      },
    },
  })
    .then(businessInfo => businessInfo)
    .catch((err) => {
      console.log(err);
    });
};

const setBusinessOwner = (userId, businessId) => {
  return Business.update({ idUser: userId }, { where: { id: businessId }});
};

const updateUser = (uid, changes) => {
  return User.update(changes, { where: { uid } });
}

// Get business by id
const getBusinessById = id => Business.findOne({
  where: {
    id,
  },
})
  .then(business => business)
  .catch((err) => {
    console.log(err);
  });

// get business by user id

const getBusinessByUser = (userId) => {
  Business.findOne({
    where: {
      idUser: userId,
    },
  })
    .then(result => result)
    .catch((err) => {
      console.log(err);
    });
};

// Add user to database
const addUser = userObj => User.create(userObj)
  .then((result) => {
    console.log('entered user into db');
    return result;
  })
  .catch((err) => {
    console.log(err);
  });
  

// Get user by firebase id
const getUserById = id => User.findOne({
  where: {
    firebaseId: id,
  },
}).then(user => user)
  .catch((err) => {
    console.log(err);
  });

const getBusinessByFirebaseId = uid => getUserById(uid)
  .then((result) => {
    return getBusinessByUser(result.id);
  })


const getUserByUserId = id => User.findOne({
  where: {
    id: id,
  },
}).then(user => user)
  .catch((err) => {
    console.log(err);
  });

// add review
const addReview = reviewObj => Review.create(reviewObj)
  .then(result => result)
  .catch((err) => {
    console.log(err);
  });

// get all the reviews of a certain business by that businesses id
const getReviewsByBusiness = businessId => Review.findAll({
  where: {
    idBusiness: businessId,
  },
})
  .then(result => result)
  .catch((err) => {
    console.log(err);
  });

// get featured image
const getFeaturedImage = imageId => Image.findOne({
  where: {
    id: imageId,
  },
})
  .then(result => result)
  .catch((err) => {
    console.log(err);
  });

// get all images for a business
const getAllImagesByBusiness = businessId => Image.findAll({
  where: { inBusiness: businessId },
})
  .then(result => result)
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  addBusiness,
  getBusinessById,
  getAllBusinesses,
  getBusinessByUser,
  addUser,
  getUserById,
  getUserByUserId,
  addReview,
  getReviewsByBusiness,
  getFeaturedImage,
  getAllImagesByBusiness,
  getAllBusinessesFromText,
  setBusinessOwner,
  getBusinessByFirebaseId,
  updateUser,
};
