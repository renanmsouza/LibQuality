const statisticModel = require('../../models/statisticModel');

class staticController {
    constructor() {
        this.Statistics = new statisticModel();
    }

    async list(req, res) {
        const result = await this.Statistics.list();

        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }
    }

    async getProjectStatistics(req, res) {
        const idProjects = req.params.id;

        const result = await this.Statistics.getProjectStatistics(idProjects);

        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }   
    }

    async getLastProjectStatistics(req, res) {
        const idProjects = req.params.id;

        const result = await this.Statistics.getLastProjectStatistics(idProjects);

        if (!result.error) {
            res.status(200).json({ result: result });
        }else{
            res.status(400).json({ result: result});
        }   
    }
}

module.exports = staticController;