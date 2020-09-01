const sqlite3 = require('sqlite3').verbose();

class statisticModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (e) => {
            if (e) {
                console.log(e);
            }
        });
    }

    list() {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Statistics', [] , (err, rows) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(rows);
                }  
            });
        })
    }

    getProjectStatistics(idProjects) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Statistics where idProjects = $id', { $id: idProjects } ,(err, rows) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(rows);
                }          
            });
        }) 
    }

    getLastProjectStatistics(idProjects) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Statistics where idProjects = $id Order by idStatistics DESC LIMIT 1', { $id: idProjects } ,(err, row) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(row);
                }          
            });
        }) 
    }
}

module.exports = statisticModel;