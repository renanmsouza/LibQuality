const sqlite3 = require('sqlite3').verbose();

class statisticModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (e) => {
            if (e) {
                console.log(e);
            }
        });
    }
}

module.exports = statisticModel;