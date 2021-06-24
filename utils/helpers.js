const hbs = require('hbs');

const createHbsHelpers = () => {
    hbs.registerHelper('gte', (a, b, opts) =>{
        if (a >= b) {
            return opts.fn(this)
        }else{
            return opts.inverse(this)
        }
    });

    hbs.registerHelper('uppercase', (str) => {
        return str.toUpperCase();
      });
};

module.exports = {
    createHbsHelpers
};
