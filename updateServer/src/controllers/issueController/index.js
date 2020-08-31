const axios = require('axios');
const parseLink = require('parse-link-header');

const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');
const issueModel = require('../../models/issueModel');
const authenticationModel = require('../../models/authenticationModel');

class issueController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.data = [];
        //Using Insert list for beter performance
        this.postIssuesList = [];
        this.postLabelsList = [];

        this.Authentication = new authenticationModel();
        this.Projects = new projectModel();
        this.Owners = new ownerModel();
        this.Issues = new issueModel();
    }

    async setIssues() {
        const gitAuth = await this.Authentication.get();
        const projectsList = await this.Projects.list();

        // Access all projects and update Issues information
        for (let i = 0; i < projectsList.length; i++) {
            //Set current project
            let project = projectsList[i];
            //Get the owner of current project
            const owner = await this.Owners.get(project.idOwners);
            //Set Conection Options
            try {
                var lastPage = 2;
                var page = 1;
                do {
                    const response = await axios({
                        method: 'get',
                        url: `https://api.github.com/repos/${owner.name}/${project.name}/issues?page=${page}&per_page=100`,
                        headers: { accept: 'application/vnd.github.v3+json' },
                        auth: {
                            username: gitAuth.gitUser,
                            password: gitAuth.gitPassword
                        }
                    });
                    this.data = this.data.concat(response.data);

                    if (page === 1) {
                        const parsedLink = parseLink(response.headers.link);
                        lastPage = parsedLink.last.page;
                    }
            
                    page++;
                } while(page <= lastPage);
            }
            catch (e) {
                console.log(`Error in Issues reading of project ${project.name}:` + e);
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
            
        };

        //Execute Insert of the Lists: Issues and Labels of Issues
        await this.Issues.post(this.postIssuesList)
            .then(await this.Issues.postLabel(this.postLabelsList));
        
        // const listIssues = await this.Issues.list();
        return this.res.json({ Page: 'Issues' });
    }

    async updateIssue(issueData, idProjects) {
        // Post or Update Issue
        var newIssue = {
            idIssues: issueData.id, 
            idProjects: idProjects, 
            url: issueData.url, 
            title: issueData.title, 
            state: issueData.state, 
            created_at: issueData.created_at, 
            updated_at: issueData.updated_at, 
            closed_at: issueData.closed_at
        };

        // Check if alread exists, if not, put then in the Insert List
        const oldIssue = await this.Issues.get(issueData.id) || [];
        if (oldIssue.idIssues) {
            // if Exists and is diferente, make an update
            if (oldIssue !== newIssue) {
                await this.Issues.set(newIssue)
            }

            return [];
        }else{
            // await this.Issues.post(newIssue);
            return newIssue;
        }
    }

    async updateLabels(issueData) {
        //Get list of Labels from API
        const newListLabels = issueData.labels;
        //Get the list os Labels in DB
        const oldListLabels = await this.Issues.listLabels(issueData.id);

        //Verify if same Labels are removed from API, deleting them fom DB
        for (let i = 0; i < oldListLabels.length; i++) {
            let found = newListLabels.some(function (newLabel) {
                return newLabel.id === oldListLabels[i].idLabels;
            });

            if (!found) {
                await this.Issues.delLabel(issueData.id, oldListLabels[i].idLabels);
            }
        }

        //Verify the labels existence in DB or put them in the Insert List
        for (let i = 0; i < newListLabels.length; i++) {
            let found = oldListLabels.some(function (oldLabel) {
                return oldLabel.idLabels === newListLabels[i].id;
            });

            if (!found) {
                return { idIssues: issueData.id, idLabels: newListLabels[i].id }
            }
        }
    }
}

module.exports = issueController;