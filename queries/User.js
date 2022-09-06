const userScheme = require('../schemasModels/User')




async function findUserByEmail(email) {
    return await userScheme.findOne({ email: email })
}


module.exports = { findUserByEmail }