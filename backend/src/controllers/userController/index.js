const userModel = require('../../models/userModel');
var CryptoJS = require('crypto-js');

class userController {
    constructor() {
        this.Users = new userModel();
    }

    async list(req, res) {
        const result = await this.Users.list();

        if (!result.error) {
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
            password: CryptoJS.AES.encrypt(data.password, 'QualityLib').toString(),
        }

        const result = await this.Users.post(user);
        
        if (!result.error) {
            res.status(201).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async get(req, res) {
        const id = req.params.id;

        const result = await this.Users.get(id);
        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async set(req, res) {
        const data = req.body;
        var user = {
            idUsers: data.idUsers,
            name: data.name,
            login: data.login,
            password: CryptoJS.AES.encrypt(data.password, 'QualityLib').toString(),
        }

        const result = await this.Users.set(user);
        if (!result.error) {
            res.status(201).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }   
    }

    async del(req, res) {
        const id = req.params.id;

        const result = await this.Users.del(id);
        if (!result.error) {
            res.status(200).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }   
    }

    async auth(req, res) {
        const data = req.body;

        const result = await this.Users.auth(data.login);
        if (result.password) {
            var hash = CryptoJS.AES.decrypt(result.password, 'QualityLib');
            const password = hash.toString(CryptoJS.enc.Utf8);
            
            if (data.password === password) {
                req.session.currentUserId = result.idUsers;
                req.session.currentUser = result.name;

                //Access Log
                var currentDate = new Date();
                var log = {
                    idUsers: result.idUsers,
                    date: currentDate.toISOString(),
                }
                await this.Users.accessLog(log);

                res.status(203).json({ result: 'success' });
            }else{
                res.status(401).json({ result: 'Invalid Password!' });
            }
            
        }else{
            res.status(401).json({ result: result});
        }
    }
}

module.exports = userController;