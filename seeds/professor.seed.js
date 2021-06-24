const mongoose = require('mongoose');

const db = require("../db");


const Professor = require("../models/Professor");

const professors = [
    {
        name: "Dr. Juan Jesús Pérez García",
        graduationYear: "1974 (Más de 40 años de experiencia)",
        title: "Médico Cirujano especialista en Cirugía oral",
        lastStudies: ["Cursos de Cirugía Básica y Avanzada 2000-2004. Santiago de Cuba.", "Licenciatura (Tesina ) Facultad de Medicina de la Universidad de Barcelona. Ministerio de Educación y Ciencia. AÑO1975. SOBRESALIENTE"],
        image: "https://res.cloudinary.com/upgradeoscar/image/upload/v1624279134/proyecto_instituto_implantolog%C3%ADa/coleccion_profesores/foto-1_amiotp.jpg"
    },
    {
        
        name: "Dr. Jesús Pérez García",
        graduationYear: "2014/09 - 2019/05 Universidad CEU San Pablo,Madrid Grado en Odontología",
        title: "Médico Cirujano Implantólogo y docente",
        lastStudies: ["2020/11 - 2020/11 Damon System, Online Experiencia Damon","2019/06 - 2019/07 Instituto Internacional de Implantología y Estética Avanzadas, (La Habana) Curso práctico de cirugía oral sobre pacientes."],
        image: "https://res.cloudinary.com/upgradeoscar/image/upload/v1624279134/proyecto_instituto_implantolog%C3%ADa/coleccion_profesores/foto-2_ng8yst.jpg",
        
    },
    {
        name: "Dr. Manuel Francisco Vallecillo Capilla",
        graduationYear: " 4-mayo de 1979 LICENCIADO EN MEDICINA Y CIRUGIA. Ministerio de Universidades e Investigación. ",
        title: "Médico Cirujano Especialista y docente",
        lastStudies:[ "2004- 2005: Cirugía Oncológica de Cabeza y Cuello. Instituto de Oncología y Radiobiología de Cuba."],
        image:"https://res.cloudinary.com/upgradeoscar/image/upload/v1624279134/proyecto_instituto_implantolog%C3%ADa/coleccion_profesores/foto-3_m6obh3.jpg"
    },
]; 

mongoose
    .connect(db.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const allProfessors = await Professor.find();

        if (allProfessors.length) {
            await Professor.collection.drop();
        }
    })
    .catch((error) => {
        console.log("Error eliminando la colección Professors", error);
    })
    .then(async () => {
        await Professor.insertMany(professors);
        console.log("Profesores añadidos con éxito");
    })
    .catch((error) => {
        console.log("error añadiendo el seed", error);
    })
    .finally(() => mongoose.disconnect());
