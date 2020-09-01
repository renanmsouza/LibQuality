const userModel = require('../../models/userModel');
var crypto = require('crypto-js');

class userController {
    constructor() {
        this.Users = new userModel();
    }

    async list(req, res) {
        const result = await this.Users.list();
        if (result === null) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async post(req, res) {
        const data = req.body;
        var user = {
            name: data.name,
            login: data.login,
            password: crypto.SHA256.encrypt(data.password, 'QualityLib').toString(),
        }

        const result = await this.Users.post(user);
        if (result === null) {
            res.status(201).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async get(req, res) {
        const id = req.params.id;

        const result = await this.Users.get(id);
        if (result === null) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async set(req, res) {
        const data = req.body;

        const result = await this.Users.set(data);
        if (result === null) {
            res.status(201).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }   
    }

    async del(req, res) {
        const id = req.params.id;

        const result = await this.Users.del(id);
        if (result === null) {
            res.status(200).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }   
    }

    async auth (req, res) {
        const data = req.body;
        var user = {
            login: data.login,
            password: crypto.SHA256.encrypt(data.password, 'QualityLib').toString(),
        }

        const result = await this.Users.auth(user);
        if (result.validuser >= 1) {
            res.status(203).json({ result: 'success' });
        }else{
            res.status(401).json({ result: result});
        }
    }
}

module.exports = userController;