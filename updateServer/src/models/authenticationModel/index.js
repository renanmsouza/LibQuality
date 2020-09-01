const sqlite3 = require('sqlite3').verbose();

class authenticationModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    get () {
        return new Promise ((resolve, reject) => {
            this.db.get('Select * from Authentication', [] , (err, rows) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(rows);
                }  
            });
            
        })
        
    }
}

module.exports = authenticationModel;