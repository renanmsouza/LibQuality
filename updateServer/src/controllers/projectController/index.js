const axios = require("axios");
const projectModel = require('../../models/projectModel');
const ownerModel = require('../../models/ownerModel');

class projectController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.data = [];

        this.Projects = new projectModel();
        this.Owners = new ownerModel();
    }

    async setProject() {
        //Get Project name and Owner from URL Query
        const { project, owner } = this.req.query;
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
            this.updateOwner(this.data.owner);
            // Post or Update Project //
            this.updateProject(this.data);

            const listProjects = await this.Projects.list();
            const listOwners = await this.Owners.list();
            return this.res.json({ listProjects, listOwners });
        } 
    }

    async updateOwner(ownerData) {
        // Create the new Object
        var newOwner = {
            idOwners: ownerData.id,
            name: ownerData.login,
            avatar: ownerData.avatar_url,
            url: ownerData.url,
            type: ownerData.type
        };

        // Check if alread exists, if not, create a new one
        const oldOwner = await this.Owners.get(ownerData.id) || [];
        if (oldOwner.idOwners) {
            // if Exists and is diferente, make an update
            if (oldOwner !== newOwner) {
                await this.Owners.set(newOwner)
            }
        }else{
            await this.Owners.post(newOwner);
        }
    }

    async updateProject(projectData) {
        // Create the new Object
        var newProject = {
            idProjects: projectData.id,
            idOwners: projectData.owner.id,
            name: projectData.name,
            description: projectData.description,
            url: projectData.url
        };

        // Check if alread exists, if not, create a new one
        const oldProject = await this.Owners.get(projectData.id) || [];
        if (oldProject.idProjects) {
            // if Exists and is diferente, make an update
            if (oldProject !== newProject) {
                await this.Projects.set(newProject)
            }
        }else{
            await this.Projects.post(newProject);
        }
    }
}

module.exports = projectController;