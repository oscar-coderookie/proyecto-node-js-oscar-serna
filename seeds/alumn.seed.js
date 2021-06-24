const mongoose = require('mongoose');
const db = require("../db");

const Alumn = require('../models/Alumn');

const alumns = [
    {
        name: "Luis Alberto",
        lastName: "Rodríguez Pérez",
        email: "luisalberto@iiea.com",
        dni: "Z-89823654",
        phone: "655-232-233",
        image: "1624052175230-foto-2.jpg"
    },  
    {
        name: "Daniel",
        lastName: "Marín Peláez",
        email: "danielmp@iiea.com",
        dni: "Z-6546263596",
        phone: "855-475-633",
        image: "1624034312179-foto-9.jpg" 
    },
    {
        name: "Enrique Arnoldo",
        lastName: "Morantes López",
        email: "enmriqueml@iiea.com",
        dni: "Y-658765102",
        phone: "852-745-532",
        image: "1624045980612-foto-3.jpg"
    }, 
];
mongoose
    .connect(db.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const allAlumns = await Alumn.find();

        if (allAlumns.length) {
            await Alumn.collection.drop();
        }
    })
    .catch((error) => {
        console.log("Error eliminando la colección Alumns", error);
    })
    .then(async () => {
        await Alumn.insertMany(alumns);
        console.log("Alumnos añadidos con éxito");
    })
    .catch((error) => {
        console.log("error añadiendo el seed", error);
    })
    .finally(() => mongoose.disconnect());