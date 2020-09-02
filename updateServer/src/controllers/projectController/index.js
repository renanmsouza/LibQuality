const axios = require("axios");
const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');

class projectController {
    constructor() {
        this.data = [];

    }

    async setProject(req, res) {
        //Get Project name and Owner from URL Query
        const { project, owner } = req.query;
        const host = `https://api.github.com/repos/${owner}/${project}`;

        try {
            const response = await axios.get(host);
            this.data = response.data;
        }
        catch (e) {
            console.log('Error in Project reading: ' + e);
        }
        finally{
            // Post or Update Owner //
            await this.updateOwner(this.data.owner);
            // Post or Update Project //
            await this.updateProject(this.data);
        }
    }

    async updateOwner(ownerData) {
        const Owners = new ownerModel();

        // Create the new Object
        var newOwner = {
            idOwners: ownerData.id,
            name: ownerData.login,
            avatar: ownerData.avatar_url,
            url: ownerData.url,
            type: ownerData.type
        };

        // Check if alread exists, if not, create a new one
        const oldOwner = await Owners.get(ownerData.id) || [];
        if (oldOwner.idOwners) {
            // if Exists and is diferente, make an update
            if (oldOwner !== newOwner) {
                await Owners.set(newOwner)
            }
        }else{
            await Owners.post(newOwner);
        }

        Owners.destroy(); 
    }

    async updateProject(projectData) {
        const Projects = new projectModel();
        const Owners = new ownerModel();

        // Create the new Object
        var newProject = {
            idProjects: projectData.id,
            idOwners: projectData.owner.id,
            name: projectData.name,
            description: projectData.description,
            url: projectData.url
        };

        // Check if alread exists, if not, create a new one
        const oldProject = await Owners.get(projectData.id) || [];
        if (oldProject.idProjects) {
            // if Exists and is diferente, make an update
            if (oldProject !== newProject) {
                await Projects.set(newProject)
            }
        }else{
            await Projects.post(newProject);
        }

        Owners.destroy(); 
        Projects.destroy();
    }
}

module.exports = projectController;