const mongoose = require('mongoose');

const { Schema, model } = mongoose;


const user = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

})

const User = model('User', user);

module.exports = {
    User,
}