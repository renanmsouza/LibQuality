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

    serach(str) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Projects Where name Like %$str%', { $str: str } , (err, rows) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(rows);
                }  
            });
        })    
    }

    add() {
        return new Promise((resolve, reject) => {
            api.get('/projects?owner=$owner&project=$project');
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