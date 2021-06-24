const express = require('express');
const path = require("path");
const dotenv = require('dotenv');
dotenv.config()
const cloudinary = require('cloudinary');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./authentication/passport');
const hbsHelpers = require('./utils/helpers');
const indexRoutes = require('./routes/index.routes');
const professorsRoutes = require('./routes/professors.routes');
const alumnsRoutes = require('./routes/alumns.routes');
const coursesRoutes = require('./routes/courses.routes');
const authRoutes = require('./routes/auth.routes')
const db = require('./db');
// conectar db:
db.connect();

const PORT = process.env.PORT || 3200;

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
    cookie: {
        maxAge: 31*24*60*60*1000
    },
    store: MongoStore.create({ mongoUrl: db.DB_URL }),
}));

// iniciar el passport
app.use(passport.initialize()); 
app.use(passport.session());
// carpeta de archivos estaticos:
app.use(express.static(path.join(__dirname, 'public')));
// parsear respuestas:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hbs:
app.set('views', path.join(__dirname, 'views'));

app.set('view engine','hbs');

hbsHelpers.createHbsHelpers();
// rutas:
app.use('/', indexRoutes);
app.use('/professors', professorsRoutes);
app.use('/alumns', alumnsRoutes);
app.use('/courses', coursesRoutes);
app.use('/auth', authRoutes);

app.use('*', (req, res) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;

    return res.status(404).json(error)
});

// control de errores:
app.use((error, req, res, next) => {

    return res.status(error.status || 500).json(error.message || 'Unexpected error');

});

app.listen(PORT, () => {
    console.log(`Servidor Funcionando correctamente en el puerto http://localhost:${PORT}`);
});
