const labelController = require('../../controllers/labelController');
const issueController = require('../../controllers/issueController');
const statisticController = require('../../controllers/statisticController');

class serverController {
    constructor() {
        this.Labels = new labelController();
        this.Issues = new issueController();
        this.Statistics = new statisticController();
    }

    async updateServer() {
        await this.Labels.setLabels()
        .then(
            await this.Issues.setIssues()
        )
        .then(
            await this.Statistics.calcStatistics()
        );
    }
}

module.exports = serverController;