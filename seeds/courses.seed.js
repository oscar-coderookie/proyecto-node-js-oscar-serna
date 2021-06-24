const mongoose = require('mongoose');
const db = require('../db');
console.log(db.DB_URL)
const Course = require('../models/Courses')

const courses = [

    {
        title: "Estética Avanzada",
        duration: "3 meses",
        professors:  [],
        nextDates: ["26 de junio 2021", "4 de septiembre de 2021 ","3 de enero de 2022"],
        location: "La Habana(Cuba)",
        image: "https://res.cloudinary.com/upgradeoscar/image/upload/v1624290537/proyecto_instituto_implantolog%C3%ADa/coleccion_cursos/foto-4_uz7wht.jpg"

    },
    {   
        title: "Cirugía Maxilofacial",
        duration: "3 meses",
        professors:  [],
        nextDates: ["26 de junio de 2021" ,"15 de julio de 2021","30 de agosto 2021 "],
        location: "La Habana(Cuba)",
        image: "https://res.cloudinary.com/upgradeoscar/image/upload/v1624290537/proyecto_instituto_implantolog%C3%ADa/coleccion_cursos/foto-1_ffebbz.jpg"
    }
];
mongoose
    .connect(db.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        const allCourses = await Course.find();

        if (allCourses.length) {
            await Course.collection.drop()
            
        }
    })
    .catch((error) => {
        console.log("Error eliminando de la colección Courses", error);
    })
    .then(async () => {
        await Course.insertMany(courses);
        console.log("Cursos semilla añadida con éxito")
    })
    .catch((error) => {
        console.log("Error añadiendo el seed..", error);
    })
    .finally(() => mongoose.disconnect());