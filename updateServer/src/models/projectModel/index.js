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
        this.db.close;

        return query;
    }

    get (id) {
        const query = this.db.run('Select * from Projects where idProjects = $id',{
            $id: id
        });
        this.db.close;

        return query;
    }

    set (project) {
        const query = this.db.run('Update Projects set idOwners = $idOwners,'+
            ' name = $name, description = $description, url = $url'+
            ' where idProjects = $idProjects'
        ,{
            $idProjects: project.idProjects,
            $idOwners: project.idOwners,
            $name: project.name,
            $description: project.description,
            $url: project.url
        });

        return query;
    }

    post (project) {
        const query = this.db.run('Insert Into Projects Values($idProjects, $idOwners, $name, $description, $url)',{
            $idProjects: project.idProjects,
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
        this.db.close;

        return query;
    }
}

module.exports = projectModel;