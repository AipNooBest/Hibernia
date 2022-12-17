const auth = require('../services/auth');

module.exports = {
    login: (req, res) => {
        const { username, password } = req.body;
        auth.login(username, password)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    },
    logout: (req, res) => {
        auth.logout(req.token)
            .then(r => res.status(200).json(r))
            .catch(e => res.status(e.code).json(e));
    }
}