const axios = require("axios");
const projectModel = require('../../models/projectModel');

class projectController {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.model = new projectModel();
        this.data = [];
    }

    async project(name, owner) {
        const host = `https://api.github.com/repos/${owner}/${name}`;
        
        try {
            const response = await axios.get(host);
            this.data = response.data;

            var listProjects = this.model.list();
        }
        catch (e) {
            console.log('Error in Project reading: ' + e);
        }
        finally {
            return this.res.json({ project: this.data, projetos: listProjects });
        }
    }
}

module.exports = projectController;