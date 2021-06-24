const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/register', (req, res, next) => {
    return res.render('registerview', { title: "Registro de Usuarios"});
});

router.post('/register', async (req, res, next) => {
    const { email, username, name, password } = req.body;

    if (!email || !username || !name || !password ) {
        const error = "completa los campos";
        return res.render("registerview", { error });
    }

    const done = (error, user) => {
        if (error) {
            return res.render("error", { message: error.message});
        }
        return res.redirect("/")
    
    };
    passport.authenticate("registration", done)(req)
});

router.get('/login', (req, res, next) => {
    return res.render("loginview");
});
    
router.post('/login', ( req, res, next) => {
    const done = (error, user) => {
        if (error) {
            return next(error)
        }
        const doneParaSerialize = (error, user) => {
            if (error) {
                return next(error);
            }

            return res.redirect('/')
        };

        req.login(user, doneParaSerialize);
    };
    passport.authenticate("login", done)(req);
});

router.post('/logout', (req, res, next) => {
    if (req.user) {
        req.logout();

        req.session.destroy(() => {

            res.clearCookie("connect.sid");
            return res.redirect('/')
        });
    }else{
        return res.status(200).json("No había usuario logueado")
    }
});

module.exports = router;