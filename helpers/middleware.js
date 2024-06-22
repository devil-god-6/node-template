
const { AuthorizationError, ResourceNotFoundError, ServerError } = require("../errors/common");

module.exports.mCommon = async function (req, res, next) {
    const error = req.flash('error');
    const success = req.flash('success');
    if (success.length) {
        res.locals.flash = {
            type: 'success',
            message: success[0]
        };
    };

    if (error.length) {
        res.locals.flash = {
            type: 'error',
            message: error[0]
        };
    };
    if (req.user) {
        res.locals.userSession = req.user;

    };

    res.locals.currentUrl = unescape(req.url);
    next();
};

module.exports.errorHandler = function (err, req, res, next) {
    if (
        err instanceof AuthorizationError ||
        err instanceof ResourceNotFoundError
    ) {
        const error = err?.toJSON();
        const renderData = {
            message: error.message,
            type: error.statusCode,
            title: error.type,
            layout: false
        };
        return res.render('pages/extra/error', renderData);
    } else {
        const error = new ServerError();
        const errorData = error.toJSON();
        const renderData = {
            message: error.message,
            type: error.statusCode,
            title: error.type,
            layout: false
        };
        return res.render('pages/extra/error', renderData);
    }
};

module.exports.checkAccess = function (access) {
    return function (req, res, next) {
        if (req.user?.accesses && (req.user.accesses.some(element => { return access.includes(element) }) || req.user.accesses[access] != undefined)) {
            next();
        } else {
            return next(new AuthorizationError());
        }
    }
};