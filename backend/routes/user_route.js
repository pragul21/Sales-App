const express = require('express');
const router = express.Router();

//for bcrypt the password to encrypt password in db
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel")
const { JWT_SECRET } = require('../config');

router.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'One or more fields are empty' })
    }
    //checking with email if user exist or not
    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: 'Already exists with this email' })
            }
            //encoding the password
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ firstName, lastName, email, password: hashedPassword });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: 'User Signed up succesfully' })
                        }).catch((error) => {
                            console.log(error);
                        })
                }).catch((error) => {
                    console.log(error);
                })
        }).catch((error) => {
            console.log(error)
        })
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'One or more field is empty' })
    }
    try {
        const userInDb = await UserModel.findOne({ email: email })
        if (!userInDb) {
            return res.status(401).json({ error: 'NO user found with this email' })
        }
        const didMatch = bcryptjs.compare(password, userInDb.password);
        if (didMatch) {
            const jwtToken = jwt.sign({ _id: userInDb._id }, JWT_SECRET);
            const userInfo = { "_id": userInDb._id, "email": userInDb.email, "firstName": userInDb.firstName, "lastName": userInDb.lastName }
            res.status(200).json({ token: jwtToken, user: userInfo })
        } else {
            return res.status(401).json({ error: 'Invalid Credentials' })
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;