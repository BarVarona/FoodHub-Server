const userScheme = require('../schemasModels/User')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { findUserByEmail } = require('../queries/User')
const { jwtSecret } = require('../middlewares/authJwt')
const sendError = () => {

}


const register = async (req, res) => {
    console.log("register func");
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
        res.status(400).send({ 'status': 'fail' })
    }

    try {
        const exists = await findUserByEmail(email)
        if (exists != null) {
            return res.status(400).send({ 'status': 'user exists' })
        }

        const salt = await bcrypt.genSalt(2)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new userScheme({
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'password': hashedPassword
        })
        console.log('user saved');
        await user.save()
        res.status(200).send('success'+user)

    } catch (err) {
        return res.status(400).send({ 'status': 'error was thrown' + err })
    }
}


const login = async (req, res) => {
    console.log('login func');
    const { email, password } = req.body

    
    if (!email || !password) {
        res.status(400).send({ 'status': 'email or password are empty' })
        console.log('email or password empty');
    }

    try {
        const user = await findUserByEmail(email)
        if (user == null) {
            res.status(400).send({ 'status': 'user not found' })
            console.log('user not exist');
            return;
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return res.status(400).send('password does not match')
            console.log('problem with decryption');
        }

        user.isConnected = true;
        user.save();

        const jwtToken = jwt.sign({ id: user._id }, jwtSecret, {
            expiresIn: '7d' // one week
        });

        console.log('user successfully connected');
        const { userPassword, isAdmin, ...other } = user._doc
        res.status(200).send({ ...other, jwtToken: jwtToken })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ 'status': 'error was thrown' + err })
    }
}


module.exports = { register, login }