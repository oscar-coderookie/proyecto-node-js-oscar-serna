const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const professorSchema = new Schema(
    {
        name: { type:String, required: true },
        graduationYear: { type: String },
        title: { type: String, required: true },
        lastStudies: [{ type:String }],
        image: {type: String }
        
    },
    { timestamps: true}
);

const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;

