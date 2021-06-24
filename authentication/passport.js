const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

passport.serializeUser((user, done) => {
    console.log(user);
    return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const existingUser = await User.findById(userId);

        return done(null, existingUser);
    } catch (error) {
        return done(error, null);
    }
});

// funcion para validar email.
const isValidEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

// validar password:_
const isValidPassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(password));
};

const loginStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const { email, username } = req.body;
            let existingUser = null;

            if (email) {
                existingUser = await User.findOne({ email });
            }
            if (username) {
                existingUser = await User.findOne({ username });
            }
            if (!existingUser) {
                const error = new Error("El usuario no existe");
                error.status = 401;
                return done(error, null);
            }
            console.log(existingUser);

            if (!isValidPassword) {
                const error = new Error("La contraseña introducida no es correcta");
                return done(error, null);
            }

            console.log(existingUser);
            existingUser.password = null;
            return done(null, existingUser);
        } catch (error) {
            console.log("Error en la estrategia de login de passport.js", error);
            return done(error, null);
        }
    }
);

const registerStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                const error = new Error("El usuario ya está registrado");
                return done(error, null);
            }

            if (!isValidEmail(email)) {
                const error = new Error("email no válido");
                return done(error, null);
            }
            if (!isValidPassword(password)) {
                const error = new Error("contraseña inválida");
                return done(error, null);
            }
            // para encriptar la contraseña para protegerla: habiendo instalado el bcrypt, e importándolo
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                email: email,
                password: passwordHash,
                name: req.body.name,
                lastName: req.body.lastName,
                username: req.body.username,
            });
            // guardamos el user en nuestra DB:

            const savedUser = await newUser.save();

            // ahora devolvemos el usuario en lugar de un error.
            // nuestra funcion

            savedUser.password = null;

            return done(null, savedUser);
        } catch (error) {
            return done(error, null);
        }
    }
);

passport.use("registration", registerStrategy);
passport.use("login", loginStrategy);
