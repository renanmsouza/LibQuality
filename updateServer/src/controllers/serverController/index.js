const labelController = require('../../controllers/labelController');
const issueController = require('../../controllers/issueController');
const statisticController = require('../../controllers/statisticController');

class serverController {
    constructor() {
        this.Labels = new labelController();
        this.Issues = new issueController();
        this.Statistics = new statisticController();
    }

    async updateServer(res) {
        await this.Labels.setLabels()
        .then(
            await this.Issues.setIssues()
        )
        .then(
            await this.Statistics.calcStatistics()
        ).then(function() {
            var currenttime = new Date();
            if (res) {
                return res.status(200).json({ lastUpdate: currenttime.toISOString() });
            } else {
                console.log('lastUpdate: ' + currenttime.toISOString());
            }
        });

        
    }
}

module.exports = serverController;