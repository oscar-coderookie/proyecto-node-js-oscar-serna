const express = require("express");
const { isAdmin, isAuthenticated } = require("../middlewares/auth.middleware");
const Course = require("../models/Courses");
const cloudinary = require('cloudinary')
const { upload, uploadToCloudinary } = require("../middlewares/file.middleware");
const Professor = require("../models/Professor");

const router = express.Router();

// router.get("/", async (req, res, next) => {
//     try {
//         const courses = await Course.find()
//         return res.status(200).render("courses", { title: "Sección de Cursos e información", courses , user:req.user});
//     } catch (error) {
//         return next(error);
//     }
// });

router.get("/", async (req, res, next) => {
    try {
        const courses = await Course.find().populate("professors");
        

        return res.status(200).render("courses", { title: "Sección de cursos", courses,  user: req.user  });
    } catch (error) {
        return next(error);
    }
});

router.put("/add-professor", async (req, res, next) => {
    try {
        const professorsId = req.body.professorsId;
        const courseId = req.body.courseId;

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { professors: professorsId } },
            { new: true }
        );
        return res.status(200).json(updatedCourse);
    } catch (error) {
        next(error);
    }
});

router.get("/createcourses",[upload.single("image"),uploadToCloudinary], [isAdmin], async (req, res, next) => {
    try {
        return res.render("createcourses", { title: "Creación de Cursos:", user: req.user });
    } catch (error) {
        return next(error);
    }
});

router.post("/createcourses",[upload.single("image"),uploadToCloudinary], [isAdmin], async (req, res, next) => {
    try {
        const { title, duration, location, nextDates, professors } = req.body;

        
        
        const image = req.fileUrl ? req.fileUrl : "";

        const newCourse = new Course({ title, duration, location, nextDates, professors, image });


        const createdCourse = await newCourse.save();
        console.log(createdCourse);
        return res.redirect(`/courses`);
    } catch (error) {
        return next(error);
    }
});

router.get('/edit/:id', [isAdmin], async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        const professors = await Professor.find()
        return res.status(200).render('editcourse', { title: `Editar: ${course.title}`, course, professors, user: req.user})
    } catch (error) {
        return next(error)
    }
});

router.post('/edit/:id',[upload.single("image"),uploadToCloudinary],[isAdmin], async (req, res, next) => {
    const { title, duration, professors, nextDates, location } = req.body;
    const { id } = req.params;
    const uploadFields = { title, duration, professors, nextDates, location };
    if (req.fileUrl) {
        uploadFields.image = req.fileUrl;
    }
    try {
        const updatedCourse = await Course.findByIdAndUpdate(id, uploadFields,{new: true});
        console.log(updatedCourse);
        return res.status(200).redirect('/courses')
    } catch (error) {
        return next(error)
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        return res.redirect('/courses')
    } catch (error) {
        return next(error)
    }
});

module.exports = router;
