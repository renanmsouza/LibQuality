const authenticationModel = require('../../models/authenticationModel');

class userController {
    constructor() {
        this.Auth = new authenticationModel();
    }

    async post(req, res) {
        const data = req.body;

        var user = {
            gitUser: data.gitUser,
            gitPassword: data.gitPassword,
        }

        await this.Auth.del();
        const result = await this.Auth.post(user);
        
        if (!result.error) {
            res.status(201).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }
    }
}

module.exports = userController;