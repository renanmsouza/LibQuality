const axios = require('axios');
const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');
const issueModel = require('../../models/issueModel');

class issueController {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.Projects = new projectModel();
        // this.Owners = new ownerModel();
        this.Issues = new issueModel();
    }

    async setIssues() {
        const projectsList = await this.Projects.list();
        // Access all projects and update Issues information
        projectsList.map(async function(project) {
            let Owners = new ownerModel();
            var Data = [];
            //Get the owner of current project
            const owner = await Owners.get(project.idOwners);
            //Set Host
            const host = `https://api.github.com/repos/${owner.name}/${project.name}/issues`;
            try {
                const response = await axios.get(host);
                Data = response.data;
            }
            catch (e) {
                console.log(`Error in Issues reading of project ${project.name}:` + e);
            }
            finally{
                const issuesList = Data;

                // Map all issues data updating or creating them
                issuesList.map(async function(issue) {
                    let Issues = new issueModel();
                    // Post or Update Issue
                    var newIssue = {
                        idIssues: issue.id, 
                        idProjects: project.idProjects, 
                        url: issue.url, 
                        title: issue.title, 
                        state: issue.state, 
                        created_at: issue.created_at, 
                        updated_at: issue.updated_at, 
                        closed_at: issue.closed_at
                    };
            
                    // Check if alread exists, if not, create a new one
                    const oldIssue = await Issues.get(issue.id) || [];
                    if (oldIssue.idIssues) {
                        // if Exists and is diferente, make an update
                        if (oldIssue !== newIssue) {
                            await Issues.set(newIssue)
                        }
                    }else{
                        await Issues.post(newIssue);
                    }
                })
            } 
        });
        const listIssues = await this.Issues.list();
        return this.res.json({ listIssues });
    }
}

module.exports = issueController;