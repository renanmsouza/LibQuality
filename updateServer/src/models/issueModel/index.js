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
                    console.log(err);
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
                    console.log(err);
                }else{
                    resolve(row);
                }          
            });
            
        })
        
    }

    set (obj) {
        return new Promise((resolve, reject) => {
            this.db.run('Update Issues set number = $number, url = $url,'+
            ' title = $title, state = $state, locked = $locked, created_at = $created_at,'+
            ' updated_at = $updated_at, closed_at = $closed_at'+
            ' where idIssues = $idIssues'
            ,{
                $idIssues: obj.idIssues,
                $number: obj.number,
                $url: obj.url,
                $title: obj.title,
                $state: obj.state,
                $locked: obj.locked,
                $created_at: obj.created_at,
                $updated_at: obj.updated_at,
                $closed_at: obj.closed_at   

            }, (err) => {
                if (err) {
                    console.log({ error: err });
                }else{
                    resolve(true);
                }    
            });
            
        })
    }

    post (objs) {
        return new Promise ((resolve, reject) => {
            this.db.run('begin transaction;'); 
            for (let i = 0; i < objs.length; i++) {
                let obj = objs[i];
                this.db.run('Insert or Replace Into Issues Values($idIssues, $idProjects, $number, $url,'+ 
                        '$title, $state, $locked, $created_at, $updated_at, $closed_at);',{
                    $idIssues: obj.idIssues,
                    $idProjects: obj.idProjects,
                    $number: obj.number,
                    $url: obj.url,
                    $title: obj.title,
                    $state: obj.state,
                    $locked: obj.locked,
                    $created_at: obj.created_at,
                    $updated_at: obj.updated_at,
                    $closed_at: obj.closed_at  
                });
            }
            this.db.run('end;', (RunResult, err) => {
                if (err) {
                    console.log(err);
                }else{
                    resolve(RunResult);
                }     
            });
            
        })
    }

    del (id) {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Issues where idIssues = $id',{
                $id: id
            }, (err) => {
                if (err) {
                    console.log({ error: err });
                }else{
                    resolve(true);
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
                    console.log(err);
                }else{
                    resolve(rows);
                }       
            });
            
        })
    }

    postLabel (labels) {
        return new Promise((resolve, reject) => {
            this.db.run('begin transaction;'); 
            for(let i = 0; i < labels.length; i++) {
                let { idIssues, idLabels } = labels[i];
                // console.log(idIssues + '|' + idLabels);
                this.db.run('Insert into IssuesLabels Values($idIssues, $idLabels)',{
                    $idIssues: idIssues,
                    $idLabels: idLabels
                });
            }
            this.db.run('end;', 
            (err) => {
                if (err) {
                    console.log({ error: err });
                }else{
                    resolve(true);
                }    
            });
            
        })
    }

    delLabel (idIssues, idLabels) {
        return new Promise((resolve, reject) => {
            this.db.run('Delete from IssuesLabels Where idIssues = $idIssues and idLabels = $idLabels',
            {
                $idIssues: idIssues,
                $idLabels: idLabels
            }, (err) => {
                if (err) {
                    console.log({ error: err });
                }else{
                    resolve(true);
                }       
            });
            
        })
    }
}

module.exports = issueModel;