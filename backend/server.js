const express = require('express');
const PORT = 1000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URL } = require('./config')

mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log('DB Connected')
})
mongoose.connection.on('error', (error) => {
    console.log('Somme error while connecting to db')
})

require('./models/user_model')
require('./models/post_model')
app.use(cors());
app.use(express.json());


app.use(require('./routes/user_route'));
app.use(require('./routes/post_route'));


app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`)
});