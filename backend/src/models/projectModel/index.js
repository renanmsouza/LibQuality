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
                    console.log(err);
                }else{
                    resolve(rows);
                }  
            });
        })
    }

    search(query) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Projects Where name Like $query', { $query: '%'+query+'%' } , (err, rows) => {
                if (err) {
                    console.log(err);
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
                $idUsers: obj.idUsers,
                $query: obj.query,
                $date: obj.date
            }, 
            (err) => {
                if (err) {
                    console.log(err);
                }else{
                    resolve(true);
                }     
            });
        })
    }

    listSearchLog() {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from SearchLog', [] , (err, rows) => {
                if (err) {
                    console.log(err);
                }else{
                    resolve(rows);
                }  
            });
        })
    }

    async add(owner, project) {        
        try {
            await api.get(`/projects/add?owner=${owner}&project=${project}`);   
        } catch (err) {
            return ({ error: err });    
        }

        return [];
    }

    get(id) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Projects where idProjects = $id', { $id: id } ,(err, row) => {
                if (err) {
                    console.log(err);
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
                    console.log(err);
                }else{
                    resolve(true);
                }     
            });
        }) 
    }
}

module.exports = projectModel;