const axios = require('axios');
var parseLink = require('parse-link-header');

const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');
const issueModel = require('../../models/issueModel');
const authenticationModel = require('../../models/authenticationModel');

class issueController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.data = [];

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

                    console.log(page+'/'+lastPage);
                    
                    page++;
                } while(page <= 1);
            }
            catch (e) {
                console.log(`Error in Issues reading of project ${project.name}:` + e);
            }
            finally{
                const issuesList = this.data;

                // Map all issues data updating or creating them
                for (let j = 0; j < issuesList.length; j++) {
                    this.updateIssue(issuesList[j], project.idProjects);
                    this.updateLabels(issuesList[j]);
                }
            }
            
        };
        
        const listIssues = await this.Issues.list();
        return this.res.json({ listIssues });
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

        // Check if alread exists, if not, create a new one
        const oldIssue = await this.Issues.get(issueData.id) || [];
        if (oldIssue.idIssues) {
            // if Exists and is diferente, make an update
            if (oldIssue !== newIssue) {
                await this.Issues.set(newIssue)
            }
        }else{
            await this.Issues.post(newIssue);
        }
    }

    async updateLabels(issueData) {
        //Get list of Labels from API
        const newListLabels = issueData.labels;
        //Get the list os Labels in DB
        const oldListLabels = await this.Issues.listLabels(issueData.id);

        //Verify the labels existence in DB, post them if necessary
        for (let i = 0; i < newListLabels.length; i++) {
            let found = oldListLabels.some(function (oldLabel) {
                return oldLabel.idLabels === newListLabels[i].id;
            });

            if (!found) {
                this.Issues.postLabel(issueData.id, newListLabels[i].id);
            }
        }

        //Verify if same Labels are removed from API, deleting them fom DB
        for (let i = 0; i < oldListLabels.length; i++) {
            let found = newListLabels.some(function (newLabel) {
                return newLabel.id === oldListLabels[i].idLabels;
            });

            if (!found) {
                this.Issues.delLabel(issueData.id, oldListLabels[i].idLabels);
            }
        }
    }
}

module.exports = issueController;