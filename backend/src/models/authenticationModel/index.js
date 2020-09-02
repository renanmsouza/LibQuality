const sqlite3 = require('sqlite3').verbose();

class authenticationModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    post(obj) {
        return new Promise ((resolve, reject) => {
            this.db.run('Insert Into Authentication Values($gitUser, $gitPassword)',{
                $gitUser: obj.gitUser,
                $gitPassword: obj.gitPassword
            }, (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
        })
    }

    del() {
        return new Promise ((resolve, reject) => {
            this.db.run('Delete from Authentication', [], 
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

module.exports = authenticationModel;