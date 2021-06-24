const indexController = (req, res, next) => {
    return res.render('index',{ title: 'Bienvenido a la web del Instituto de Implantología', user: req.user })
};

module.exports = {
    indexController,
}