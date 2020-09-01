const sqlite3 = require('sqlite3').verbose();

class labelModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    list () {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Labels', [] , (err, rows) => {
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
            this.db.get('Select * from Labels where idLabels = $id', { $id: id } ,(err, row) => {
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
            this.db.run('Update Labels set url = $url,'+
            ' name = $name, color = $color, description = $description'+
            ' where idLabels = $idLabels'
            ,{
                $url: obj.url,
                $name: obj.name,
                $color: obj.color,
                $description: obj.description 

            }, (err) => {
                if (err) {
                    console.log(err) // reject({ error: err });
                }else{
                    resolve(true);
                }      
            });
        })
    }

    post (obj) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into Labels Values($idLabels, $idProjects, $url, $name, $color, $description)',{
                $idLabels: obj.idLabels,
                $idProjects: obj.idProjects,
                $url: obj.url,
                $name: obj.name,
                $color: obj.color,
                $description: obj.description
            }, (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }    
            });
        })
    }

    del (id) {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Labels where idLabels = $id',{
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

module.exports = labelModel;