const userSchema = require('../schemasModels/User')
const jwt = require("jsonwebtoken");

const jwtSecret = "503afc4bd66d51aeda05cbcdbf07ad0d560d03fe0819f365629c48299e92b539"

const verifyJwt = (req, res, next) => {
    const jwtToken = req.headers["x-access-token"]
    if (!jwtToken) {
        return res.status(401).send("Unauthorized (No token)!")
    }
    jwt.verify(jwtToken, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized!")
      }
      req.userId = decoded.id
      next()
    });
};

module.exports = { verifyJwt, jwtSecret }