const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alumnSchema = new Schema (
    {
        name: { type: String, required: true },
        lastName: { type: String },
        email: { type: String, required: true },
        dni: { type:String, required: true },
        image: { type: String },
        phone: { type: String, required: true }
    },
    { timestamps: true}
);

const Alumn = mongoose.model('Alumn', alumnSchema);

module.exports = Alumn;