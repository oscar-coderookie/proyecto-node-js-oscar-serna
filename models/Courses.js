const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const courseSchema = new Schema(
    {
        title: { type:String, required: true },
        duration: { type:String, required: true },
        // quiero relacionar los ids de los profesores que dictan dicho curso:
        professors: [{ type:mongoose.Types.ObjectId, ref: 'Professor'}],
        // en este array quiero reunir las próximas fechas de cada c+urso:
        nextDates: [{type: String}],
        location: { type: String, required: true },
        image: {type: String}

    },
    {timestamps: true}
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;