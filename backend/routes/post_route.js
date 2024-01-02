const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostModel = mongoose.model("PostModel");
const protectedRoute = require('../middleware/protectedResource')


router.post('/addsales', protectedRoute, (req, res) => {
    const { productName, quantity, amount } = req.body;
    if (!productName || !quantity || !amount) {
        return res.status(400).json({ error: 'One or more field is empty' })
    }

    const postObj = new PostModel({ productName, quantity, amount })
    postObj.save()
        .then((newSale) => {
            return res.status(201).json({ sale: newSale })
        }).catch((error) => {
            console.log(error);
        })
});


router.get('/sale', (req, res) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // getting todays 5 record using timeStamp's "createdAt"
    PostModel.find({ createdAt: { $gte: today } }).sort({ amount: -1 }).limit(5)

        .then((dbSale) => {
            return res.status(200).json({ Top5Sale: dbSale })
        }).catch((error) => {
            console.log(error)
        })
});

router.get('/totalrevenue', (req, res) => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    PostModel.aggregate([
        {
            $match: {
                createdAt: { $gte: today }
            }
        },
        {
            $group: {
                _id: null,
                amount: { $sum: "$amount" }
            }
        }
    ])
        .then((dbTodaysTotal) => {
            if (dbTodaysTotal && dbTodaysTotal.length > 0) {
                return res.status(200).json({ TodayRevenue: dbTodaysTotal[0].amount });
            } else {
                return res.status(200).json({ TodayRevenue: 0 });
            }
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' })
        })
})

module.exports = router;