const express = require("express");
const Alumn = require("../models/Alumn");
const { upload, uploadToCloudinary } = require("../middlewares/file.middleware")
const cloudinary = require('cloudinary')
const { isAdmin, isAuthenticated } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", [isAuthenticated], async (req, res, next) => {
    try {
        const alumns = await Alumn.find();
        return res.status(200).render("alumns", { title: "Sección de Alumnos", alumns, user: req.user });
    } catch (error) {
        return next(error);
    }
});

router.get("/createalumns", [isAdmin], async (req, res, next) => {
    try {
        return res.render("createalumns", { title: "Registro de nuevos Alumnos", user: req.user });
    } catch (error) {
        return next;
    }
});

router.post("/createalumns", [upload.single("image"), uploadToCloudinary], [isAdmin], async (req, res, next) => {
    try {
        const { name, lastName, email, dni, phone } = req.body;
        const image = req.fileUrl ? req.fileUrl : "";
        const newAlumn = new Alumn({ name, lastName, email, dni, image, phone });
        const createdAlumn = await newAlumn.save();
        console.log(("created Alumn -->", createdAlumn));
        return res.redirect(`/alumns/${createdAlumn._id}`);
    } catch (error) {
        return next(error);
    }
});

// pantalla de edit alumns(formulario):
router.get("/edit/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const alumn = await Alumn.findById(id);
        return res
            .status(200)
            .render("editalumns", { title: `Bienvenido ${alumn.name}`, alumn: alumn, user: req.user });
    } catch (error) {
        return next(error);
    }
});

// metodo put en handlebars:
router.post("/edit/:id", [upload.single("image"), uploadToCloudinary], [isAdmin], async (req, res, next) => {
    const { name, lastName, email, dni, phone } = req.body;
    const { id } = req.params;
    const uploadFields = { name, lastName, email, dni, phone };
    if (req.fileUrl) {
        uploadFields.image = req.fileUrl;
    }
    try {
        const updatedAlumn = await Alumn.findByIdAndUpdate(id, uploadFields, { new: true });
        console.log(updatedAlumn);

        return res.redirect("/alumns");
        // return res.status(200).redirect('/');
    } catch (error) {
        return next(error);
    }
});

router.get("/delete/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await Alumn.findByIdAndDelete(id);
        return res.redirect("/alumns");
    } catch (error) {
        return next(error);
    }
});

router.get("/:id", [isAuthenticated], async (req, res, next) => {
    try {
        const { id } = req.params;
        const alumn = await Alumn.findById(id);
        return res.status(200).render("alumn", { title: `Bienvenido ${alumn.name}`, alumn, user: req.user });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
