
const Handlebars = require('handlebars');
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');
const builtInHelpers = require('handlebars-helpers')({
    handlebars: Handlebars
});

const customHelper = {
    /**
     * helper function for debug view variables into server log
     * @param  {string}
     * @return {null|void}
     */
    debug: function (data) {
        console.log(data);
    },
    section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
};
const helpers = {
    ...builtInHelpers,
    ...customHelper
};
module.exports = {
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    defaultLayout: 'main',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: helpers
};