const sqlite3 = require('sqlite3').verbose();

class issueModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    list () {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Issues', [] , (err, rows) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(rows);
                }  
            });
        })
        
    }

    get(id) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Issues where idIssues = $id', { $id: id } ,(err, row) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(row);
                }          
            });
        })
        
    }

    set (obj) {
        return new Promise((resolve, reject) => {
            this.db.run('Update Issues set url = $url,'+
            ' title = $title, state = $state, created_at = $created_at,'+
            ' updated_at = $updated_at, closed_at = $closed_at'+
            ' where idIssues = $idIssues'
            ,{
                $url: obj.url,
                $title: obj.title,
                $state: obj.state,
                $created_at: obj.created_at,
                $updated_at: obj.updated_at,
                $closed_at: obj.closed_at   

            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                }     
            });
        })
    }

    post (obj) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into Issues Values($idIssues, $idProjects, $url, $title, $state, $created_at, $updated_at, $closed_at)',{
                $idIssues: obj.idIssues,
                $idProjects: obj.idProjects,
                $url: obj.url,
                $title: obj.title,
                $state: obj.state,
                $created_at: obj.created_at,
                $updated_at: obj.updated_at,
                $closed_at: obj.closed_at  
            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                    console.log(RunResult);
                }     
            });
        })
    }

    del (id) {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Issues where idIssues = $id',{
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

    listLabels (idIssues) {
        return new Promise((resolve, reject) => {
            this.db.all('Select * from IssuesLabels Where idIssues = $idIssues',{
                $idIssues: idIssues
            }, (err, rows) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(rows);
                }       
            });
        })
    }

    postLabel (idIssues, idLabels) {
        return new Promise((resolve, reject) => {
            this.db.run('Insert into IssuesLabels Values($idIssues, $idLabels)',{
                $idIssues: idIssues,
                $idLabels: idLabels
            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                }       
            });
        })
    }

    delLabel (idIssues, idLabels) {
        return new Promise((resolve, reject) => {
            this.db.run('Delte from IssuesLabels Where idIssues = $idIssues and idLabels = $idLabels)',{
                $idIssues: idIssues,
                $idLabels: idLabels
            }, (RunResult, err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(RunResult);
                }       
            });
        })
    }
}

module.exports = issueModel;