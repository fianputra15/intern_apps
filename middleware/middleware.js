const jwt = require('jsonwebtoken');
process.env.SECRET_KEY = 'secret';
const withAuth = function(req, res, next) {
    const header = req.headers['token'];
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}
module.exports = withAuth;
