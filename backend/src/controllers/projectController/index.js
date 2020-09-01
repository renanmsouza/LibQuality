const projectModel = require('../../models/projectModel');

class projectController {
    constructor() {
        this.Projects = new projectModel();
    }

    async list(req, res) {
        const result = await this.Users.list();

        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async add(req, res) {
        const data = req.body;

        const result = await this.Projects.add(data.owner, data.project);
        
        if (!result.error) {
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


    async del(req, res) {
        const id = req.params.id;

        const result = await this.Users.del(id);
        if (!result.error) {
            res.status(200).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }   
    }
}

module.exports = projectController;