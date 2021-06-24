const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema (
    {
        email: { type: String, required: true },
        username: { type: String, required: true },
        name: { type: String, required: true},
        lastName: { type:String },
        password: {type: String, required:true },
        role: {type: String, enum: ['admin', 'user'], default: 'user'}
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
