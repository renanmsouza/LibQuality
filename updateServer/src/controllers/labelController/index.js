const axios = require("axios");
const labelModel = require('../../models/labelModel');
const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');

class labelController {
    constructor() {
        this.data = [];

        this.Labels = new labelModel();
        this.Projects = new projectModel();
        this.Owners = new ownerModel();
    }

    async setLabels() {
        const projectsList = await this.Projects.list();
        // Access all projects and update Labels information
        for (let i = 0; i < projectsList.length; i++) {
            //Set current project
            let project = projectsList[i];
            //Get the owner of current project
            const owner = await this.Owners.get(project.idOwners);
            //Set Host
            const host = `https://api.github.com/repos/${owner.name}/${project.name}/labels?per_page=100`;
            try {
                const response = await axios.get(host);
                this.data = response.data;
            }
            catch (e) {
                console.log(`Error in Issues reading of project ${project.name}:` + e);
            }
            finally{
                const labelsList = this.data;
                // Map all issues data updating or creating them
                for (let j = 0; j < labelsList.length; j++) {
                    // Post or Update Label
                    this.updateLabel(labelsList[j], project.idProjects);
                }
            } 
        };
    }

    async updateLabel(labelData, idProjects) {
        var newLabel = {
            idLabels: labelData.id, 
            idProjects: idProjects, 
            url: labelData.url, 
            name: labelData.name, 
            color: labelData.color, 
            description: labelData.description
        };
        
        // Check if alread exists, if not, create a new one
        const oldLabel = await this.Labels.get(labelData.id) || [];
        if (oldLabel.idLabels) {
            // if Exists and is diferente, make an update
            if (oldLabel !== newLabel) {
                await this.Labels.set(newLabel)
            }
        }else{
            await this.Labels.post(newLabel);
        }
    }
}

module.exports = labelController;