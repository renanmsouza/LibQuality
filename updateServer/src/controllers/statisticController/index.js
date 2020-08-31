const statisticModel = require('../../models/statisticModel');
const projectModel = require('../../models/projectModel');
const issueModel = require('../../models/issueModel');

class staticController {
    constructor() {

        this.Statistics = new StatisticModel();
        this.Projects = new projectModel();
        this.Issues = new issueModel();
    }

    async calculateProjects () {
        const projectList = await this.Projects.list();

        for (let i = 0; i < projectList.length; i++) {
            let project = projectList[i];

            const issuesList = this.Projects.listProjectIssues(project.idProjects);
        }
    }
}

module.exports = staticController;