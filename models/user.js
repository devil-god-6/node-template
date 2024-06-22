const mongoose = require('mongoose');

const options = {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn',
    },
};

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
}, options);

const Model = mongoose.model('User', schema, 'Users');
module.exports = Model;