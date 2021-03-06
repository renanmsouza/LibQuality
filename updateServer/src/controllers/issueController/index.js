const axios = require('axios');
const parseLink = require('parse-link-header');

const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');
const issueModel = require('../../models/issueModel');
const authenticationModel = require('../../models/authenticationModel');

class issueController {
    constructor() {
        this.data = [];
        //Using Insert list for beter performance
        this.postIssuesList = [];
        this.postLabelsList = [];
    }

    async setIssues() {
        const Authentication = new authenticationModel();
        const Projects = new projectModel();
        const Owners = new ownerModel();
        const Issues = new issueModel();

        const gitAuth = await Authentication.get();
        const projectsList = await Projects.list();

        // Access all projects and update Issues information
        for (let i = 0; i < projectsList.length; i++) {
            //Empty Post lists
            this.postIssuesList = [];
            this.postLabelsList = [];
            //Set current project
            let project = projectsList[i];
            //Get the owner of current project
            const owner = await Owners.get(project.idOwners);
            //Set Conection Options
            try {
                // Temporary lastPage value.
                var lastPage = 2;
                var page = 1;
                do {
                    const response = await axios({
                        method: 'get',
                        url: `https://api.github.com/repos/${owner.name}/${project.name}/issues?page=${page}&per_page=100&state=all`,
                        headers: { accept: 'application/vnd.github.v3+json' },
                        auth: {
                            username: gitAuth.gitUser,
                            password: gitAuth.gitPassword
                        }
                    });
                    this.data = this.data.concat(response.data);

                    if (page === 1) {
                        const parsedLink = parseLink(response.headers.link);
                        // Real last page value from Headers
                        lastPage = parsedLink.last.page;
                    }
            
                    page++;
                } while(page <= 10);
                // For performance reasons, i'll work with the 10 firsts pages
                // Change the 10 for lastPage to get the full reading (Abaut 10min just for the React project)
                // } while(page <= lastPage);
            }
            catch (err) {
                console.log(`Error in Issues reading of project ${project.name}:` + err);
            }
            finally{
                const issuesList = this.data;

                // Map all issues data updating or creating them
                for (let j = 0; j < issuesList.length; j++) {
                    //Mount the Insert list for Issue
                    var resultIssue = await this.updateIssue(issuesList[j], project.idProjects);
                    this.postIssuesList = this.postIssuesList.concat(resultIssue);

                    //Mount Insert List for Issues Labels
                    var resultLabel = await this.updateLabels(issuesList[j]);
                    if (resultLabel) {
                        this.postLabelsList = this.postLabelsList.concat(resultLabel);
                    }
                }
            }

            //Execute Insert of the Lists: Issues and Labels of Issues
            await Issues.post(this.postIssuesList)
                .then(await Issues.postLabel(this.postLabelsList));
            
        };

        Authentication.destroy();
        Projects.destroy(); 
        Owners.destroy();
        Issues.destroy();
    }

    async updateIssue(issueData, idProjects) {
        const Issues = new issueModel();
        // Post or Update Issue
        var newIssue = {
            idIssues: issueData.id, 
            idProjects: idProjects,
            number: issueData.number, 
            url: issueData.url, 
            title: issueData.title, 
            state: issueData.state,
            locked: issueData.locked, 
            created_at: issueData.created_at, 
            updated_at: issueData.updated_at, 
            closed_at: issueData.closed_at
        };

        // Check if alread exists, if not, put then in the Insert List
        const oldIssue = await Issues.get(issueData.id) || [];
        if (oldIssue.idIssues) {
            // if Exists and is diferente, make an update
            if (oldIssue !== newIssue) {
                await Issues.set(newIssue)
            }

            Issues.destroy();
            return [];
        }else{
            // await this.Issues.post(newIssue);
            Issues.destroy();
            return newIssue;
        }
    }

    async updateLabels(issueData) {
        const Issues = new issueModel();
        //Get list of Labels from API
        const newListLabels = issueData.labels;
        //Get the list os Labels in DB
        const oldListLabels = await Issues.listLabels(issueData.id);

        //Verify if same Labels are removed from API, deleting them fom DB
        for (let i = 0; i < oldListLabels.length; i++) {
            let found = newListLabels.some(function (newLabel) {
                return (newLabel.id === oldListLabels[i].idLabels && issueData.id === oldListLabels[i].idIssues);
            });

            if (!found) {
                await Issues.delLabel(issueData.id, oldListLabels[i].idLabels);
            }
        }

        //Verify the labels existence in DB or put them in the Insert List
        for (let i = 0; i < newListLabels.length; i++) {
            let found = oldListLabels.some(function (oldLabel) {
                return (oldLabel.idLabels === newListLabels[i].id && oldLabel.idIssues === issueData.id);
            });

            if (!found) {
                return { idIssues: issueData.id, idLabels: newListLabels[i].id }
            }
        }

        Issues.destroy();
    }
}

module.exports = issueController;