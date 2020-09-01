const sqlite3 = require('sqlite3').verbose();
// API do Update Server
const api = require('../../update');

class projectModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    list() {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Projects', [] , (err, rows) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(rows);
                }  
            });
        })
        
    }

    search(query) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Projects Where name Like %$str%', { $query: query } , (err, rows) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(rows);
                }  
            });
        })    
    }

    searchLog(obj) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into SearchLog Values(null, $idUsers, $query, $date)',
            {
                $idUsers: obj.name,
                $query: obj.query,
                $date: obj.date
            }, 
            (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
        })
    }

    add(owner, project) {
        return new Promise((resolve, reject) => {
            const result = [];
            
            try {
                result = api.get(`/projects?owner=${owner}&project=${project}`);    
            } catch (err) {
                reject(err);    
            }finally{
                resolve(result);
            }
        })
    }

    get(id) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Projects where idProjects = $id', { $id: id } ,(err, row) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(row);
                }          
            });
        })
        
    }

    del(id) {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Projects where idProjects = $id',{
                $id: id
            }, (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
        }) 
    }
}

module.exports = projectModel;