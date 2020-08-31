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
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Projects', [] , (err, rows) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(rows);
                }  
            });
        })
    }

    get (id) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Projects where idProjects = $id', { $id: id } ,(err, row) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(row);
                }          
            });
        })
    }

    set (project) {
        return new Promise ((resolve, reject) => {
            this.db.run('Update Projects set idOwners = $idOwners,'+
            ' name = $name, description = $description, url = $url'+
            ' where idProjects = $idProjects'
            ,{
                $idProjects: project.idProjects,
                $idOwners: project.idOwners,
                $name: project.name,
                $description: project.description,
                $url: project.url
            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                }     
            });
        })
    }

    post (project) {
        return new Promise((resolve, reject) => {
            this.db.run('Insert Into Projects Values($idProjects, $idOwners, $name, $description, $url)',{
                $idProjects: project.idProjects,
                $idOwners: project.idOwners,
                $name: project.name,
                $description: project.description,
                $url: project.url
            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                }     
            });
        })
    }

    del (id) {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Projects where idProjects = $id',{
                $id: id
            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                }     
            });
        })
    }

    listProjectIssues(id) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Issues Where idProjects = $id', { $id: id } , (err, rows) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(rows);
                }  
            });
        })
    }
}

module.exports = projectModel;