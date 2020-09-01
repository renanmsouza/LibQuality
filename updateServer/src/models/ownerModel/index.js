const sqlite3 = require('sqlite3').verbose();

class ownerModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    list () {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Owners', [] , (err, rows) => {
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
            this.db.get('Select * from Owners where idOwners = $id', { $id: id } ,(err, row) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(row);
                }          
            });
            
        })
        
    }

    set (owner) {
        return new Promise((resolve, reject) => {
            this.db.run('Update Owners set name = $name,'+
            ' avatar = $avatar, url = $url, type = $type'+
            ' where idOwners = $idOwners'
            ,{
                $idOwners: owner.idOwners,
                $name: owner.name,
                $avatar: owner.avatar,
                $url: owner.url,
                $type: owner.type
            }, (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
            
        })
    }

    post (owner) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into Owners Values($idOwners, $name, $avatar, $url, $type)',{
                $idOwners: owner.idOwners,
                $name: owner.name,
                $avatar: owner.avatar,
                $url: owner.url,
                $type: owner.type
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
            this.db.run('Delete from Owners where idOwners = $id',{
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

module.exports = ownerModel;