const axios = require("axios");

class projectController {
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.data = [];
    }

    async project(name, owner) {
        const host = `https://api.github.com/repos/${owner}/${name}`;
        
        try {
            const response = await axios.get(host);
            this.data = response.data;
        }
        catch (e) {
            console.log('Error in Project reading: ' + e);
        }
        finally {
            return this.res.json({ project: this.data });
        }
    }
}

module.exports = projectController;