const { ResourceNotFoundError } = require("../errors/common");

const getHome = async (req, res, next) => {
    try {
        console.log('hereeee');
        if(true) {
            return next(new ResourceNotFoundError());
        }
        res.render('pages/home/index', { title: 'Home' })   
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getHome
};