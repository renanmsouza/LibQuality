const sqlite3 = require('sqlite3').verbose();

class userModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    list () {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Users', [] , (err, rows) => {
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
            this.db.get('Select * from Users where idUsers = $id', { $id: id } ,(err, row) => {
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
            this.db.run('Update Users set name = $name,'+
            ' login = $login, password = $password'+
            ' where idUsers = $idUsers'
            ,{
                $name: obj.name,
                $login: obj.login,
                $password: obj.password
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
            this.db.run('Insert Into Users Values(null, $name, $login, $password)',{
                $name: obj.name,
                $login: obj.login,
                $password: obj.password
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
            this.db.run('Delete from Users where idUsers = $id',{
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

    auth (user) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select COUNT(*) as validuser from Users where login = $login and password = $password', 
                { 
                    $login: user.login,
                    $password: user.password 
                },
                (err, row) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(row);
                }          
            });
        })    
    }
}

module.exports = userModel;