const axios = require("axios");
const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');

class projectController {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.Projects = new projectModel();
        this.Owners = new ownerModel();
        this.data = [];
    }

    async project(name, owner) {
        const host = `https://api.github.com/repos/${owner}/${name}`;
        
        try {
            const response = await axios.get(host);
            this.data = response.data;

            var listProjects = this.Projects.list();
            var listOwners = this.Owners.list();
        }
        catch (e) {
            console.log('Error in Project reading: ' + e);
        }
        finally {
            // Post or Update Owner //
            this.updateOwner(this.data.owner);
            // Post or Update Project //
            // this.updateProject(this.data);
            
            return this.res.json({ listProjects, listOwners });
        }
    }

    updateOwner(ownerData) {
        // Create the new Object
        var newOwner = {
            idOwners: ownerData.id,
            name: ownerData.login,
            avatar: ownerData.avatar_url,
            url: ownerData.url,
            type: ownerData.type
        };

        // Check if alread exists, if not, create a new one
        var oldOwner = this.Owners.get(ownerData.id);
        if (oldOwner.idOwners) {
            // if Exists and is diferente, make an update
            if (oldOwner !== newOwner) {
                this.Owners.set(newOwner)
            }
        }else{
            this.Owners.post(newOwner);
        }
    }

    updateProject(projectData) {
        // Create the new Object
        var newProject = {
            idProjects: projectData.id,
            idOwners: projectData.owner.id,
            name: projectData.name,
            description: projectData.description,
            url: projectData.url
        };

        // Check if alread exists, if not, create a new one
        var oldProject = this.Owners.get(projectData.id);
        if (oldProject.idProjects) {
            // if Exists and is diferente, make an update
            if (oldProject !== newProject) {
                this.Projects.set(newProject)
            }
        }else{
            this.Projects.post(newProject);
        }
    }
}

module.exports = projectController;