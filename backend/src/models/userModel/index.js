const sqlite3 = require('sqlite3').verbose();

class userModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    list() {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Users', [] , (err, rows) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(rows);
                }  
            });
        })
        
    }

    get(id) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Users where idUsers = $id', { $id: id } ,(err, row) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(row);
                }          
            });
        })
        
    }

    set(obj) {
        return new Promise((resolve, reject) => {
            this.db.run('Update Users set name = $name,'+
            ' login = $login, password = $password'+
            ' where idUsers = $idUsers'
            ,{
                $idUsers: obj.idUsers,
                $name: obj.name,
                $login: obj.login,
                $password: obj.password
            }, (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
        })
    }

    post(obj) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into Users Values(null, $name, $login, $password)',{
                $name: obj.name,
                $login: obj.login,
                $password: obj.password
            }, (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
        })
    }

    del(id) {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Users where idUsers = $id',{
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

    auth(login) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Users where login = $login', 
                { 
                    $login: login,
                },
                (err, row) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(row);
                }          
            });
        })    
    }

    accessLog(obj) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into AccessLog Values(null, $idUsers, $date)',
            {
                $idUsers: obj.idUsers,
                $date: obj.date,
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
}

module.exports = userModel;