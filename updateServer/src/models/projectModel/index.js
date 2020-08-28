const sqlite3 = require('sqlite3').verbose();

class projectModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (e) => {
            if (e) {
                console.log(e);
            }
        });
    }

    list () {
        const query = this.db.run('Select * from Projects');

        return query;
    }

    get (id) {
        const query = this.db.run('Select * from Projects where idProjects = $id',{
            $id: id
        });

        return query;
    }

    set (project) {
        const query = this.db.run('Update Projects set idOwners = $idOwners,'+
            ' name = $name, description = $description, url = $url'+
            ' where idProjects = $id'
        ,{
            $id: project.id,
            $idOwners = project.idOwners,
            $name: project.name,
            $description: project.description,
            $url: project.url
        });

        return query;
    }

    post (project) {
        const query = this.db.run('Insert Into Projects Values($idOwners, $name, $description, $url)',{
            $idOwners: project.idOwners,
            $name: project.name,
            $description: project.description,
            $url: project.url
        });

        return query;
    }

    del (id) {
        const query = this.db.run('Delete from Projects where idProjects = $id',{
            $id: id
        });

        return query;
    }
}

module.exports = projectModel;