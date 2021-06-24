const express = require("express");
const { isAdmin, isAuthenticated } = require("../middlewares/auth.middleware");
const Professor = require("../models/Professor");
const cloudinary = require("cloudinary");
const { upload, uploadToCloudinary } = require("../middlewares/file.middleware");
const router = express.Router();

router.get("/", [isAuthenticated], async (req, res, next) => {
    try {
        const professors = await Professor.find();
        return res.status(200).render("professors", { title: "Equipo Docente", professors, user: req.user });
    } catch (error) {
        return next(error);
    }
});

router.get("/createprofessors", [upload.single("image"), uploadToCloudinary], [isAdmin], async (req, res, next) => {
    try {
        return res.render("createprofessors", { title: "Registro de Docentes", user: req.user });
    } catch (error) {
        return next(error);
    }
});

router.post("/createprofessors", [upload.single("image"), uploadToCloudinary], [isAdmin], async (req, res, next) => {
    try {
        const { name, graduationYear, title, lastStudies } = req.body;

        console.log(lastStudies);

        const image = req.fileUrl ? req.fileUrl : "";
        const newProfessor = new Professor({ name, graduationYear, title, lastStudies, image });

        const createdProfessor = await newProfessor.save();
        console.log(("created professor -->", createdProfessor));
        return res.redirect(`/professors/${createdProfessor._id}`);
    } catch (error) {
        next(error);
    }
});
router.get("/edit/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findById(id);
        return res
            .status(200)
            .render("editprofessor", { title: `Editar CV - Docente: ${professor.name}`, professor: professor });
    } catch (error) {
        return next(error);
    }
});
router.post("/edit/:id", [upload.single("image"), uploadToCloudinary], [isAdmin], async (req, res, next) => {
    const { name, graduationYear, title, lastStudies } = req.body;
    const { id } = req.params;
    const uploadFields = { name, graduationYear, title, lastStudies };
    if (req.fileUrl) {
        uploadFields.image = req.fileUrl;
    }
    try {
        const updatedProfessor = await Professor.findByIdAndUpdate(id, uploadFields, { new: true });
        console.log(updatedProfessor);

        return res.redirect(`/professors/${updatedProfessor._id}`);
        // return res.status(200).json(updatedProfessor);
    } catch (error) {
        return next(error);
    }
});

router.get("/delete/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await Professor.findByIdAndDelete(id);
        return res.redirect("/professors");
    } catch (error) {
        return next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const professor = await Professor.findById(id);
        return res.status(200).render("professor", { title: "Detalle CV Docente:", professor, user: req.user});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
