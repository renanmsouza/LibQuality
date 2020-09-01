const projectModel = require('../../models/projectModel');

class projectController {
    constructor() {
        this.Projects = new projectModel();
    }

    async list(req, res) {
        const result = await this.Projects.list();

        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async search(req, res) {
        const data = req.body;

        const result = await this.Projects.search(data.query);
        if (!result.error) {
            //Log record of the Search
            var currentdate = new Date();
            var log = {
                idUsers: req.headers.currentuserid || 0,
                query: data.query,
                date: currentdate.toISOString(),
            }
            await this.Projects.searchLog(log);

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

        const result = await this.Projects.get(id);
        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }


    async del(req, res) {
        const id = req.params.id;

        const result = await this.Projects.del(id);
        if (!result.error) {
            res.status(200).json({ result: 'success' });
        }else{
            res.status(400).json({ result: result});
        }   
    }
}

module.exports = projectController;