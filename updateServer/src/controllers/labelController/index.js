const axios = require("axios");
const labelModel = require('../../models/labelModel');
const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');

class labelController {
    constructor() {
        this.data = [];
    }

    async setLabels() {
        const Labels = new labelModel();
        const Projects = new projectModel();
        const Owners = new ownerModel();

        const projectsList = await Projects.list();
        // Access all projects and update Labels information
        for (let i = 0; i < projectsList.length; i++) {
            //Set current project
            let project = projectsList[i];
            //Get the owner of current project
            const owner = await Owners.get(project.idOwners);
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

        Labels.destroy();
        Projects.destroy();
        Owners.destroy();
    }

    async updateLabel(labelData, idProjects) {
        const Labels = new labelModel();

        var newLabel = {
            idLabels: labelData.id, 
            idProjects: idProjects, 
            url: labelData.url, 
            name: labelData.name, 
            color: labelData.color, 
            description: labelData.description
        };
        
        // Check if alread exists, if not, create a new one
        const oldLabel = await Labels.get(labelData.id) || [];
        if (oldLabel.idLabels) {
            // if Exists and is diferente, make an update
            if (oldLabel !== newLabel) {
                await Labels.set(newLabel)
            }
        }else{
            await Labels.post(newLabel);
        }

        Labels.destroy();
    }
}

module.exports = labelController;