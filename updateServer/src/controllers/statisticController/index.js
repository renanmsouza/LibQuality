const statisticModel = require('../../models/statisticModel');
const projectModel = require('../../models/projectModel');

class staticController {
    constructor() {
        this.postList = [];

        this.Statistics = new statisticModel();
        this.Projects = new projectModel();
    }

    async calcStatistics () {
        const projectList = await this.Projects.list();

        for (let i = 0; i < projectList.length; i++) {
            var project = projectList[i];
            var sumSqAvgDiff = 0;
            var totalClosedIssues = [];
            var totalOpenedIssues = [];
            var stdIssueAge = 0;
            var avgIssueAge = 0;
            
            try{
                totalClosedIssues = await this.Statistics.getTotalIssuesByState(project.idProjects, 'closed');
                totalOpenedIssues = await this.Statistics.getTotalIssuesByState(project.idProjects, 'open');
    
                const infoCloseIssues = await this.Statistics.getInfosClosedIssues(project.idProjects);
    
                avgIssueAge = (infoCloseIssues.TotalGap / infoCloseIssues.TotalRows);
    
                //Calculating the Standard Deviation
                const gapsIssues = await this.Statistics.listGapFromClosedIssues(project.idProjects);
    
                for (let j = 0; j < gapsIssues.length; j++) {
                    let gapIssue = gapsIssues[j];
    
                    // Calc the difference from avgAge and Close Gap
                    let avgDiff = Math.abs(gapIssue.CloseGap - avgIssueAge);
                    
    
                    sumSqAvgDiff = sumSqAvgDiff + (avgDiff * avgDiff);
                }
                
                //Standard Deviation Value
                var stdIssueAge = Math.sqrt(sumSqAvgDiff / totalClosedIssues.total);
            }catch (err) {
                console.log(`Error in Statistics Calculation in Project ID ${project.idProjects}:` + err);
            }finally{
                var currentDate = new Date();
                this.postList = this.postList.concat({
                    idProjects: project.idProjects,
                    calculationDate: currentDate.toISOString(),
                    openIssues: totalOpenedIssues.total,
                    closeIssues: totalClosedIssues.total,
                    avgAge: avgIssueAge.toFixed(2),
                    stdAge: stdIssueAge.toFixed(2)
                })
            }
        }

        // Post the Calculated Statistics List
        const result = await this.Statistics.post(this.postList);
    }
}

module.exports = staticController;