const sqlite3 = require('sqlite3').verbose();

class statisticModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (e) => {
            if (e) {
                console.log(e);
            }
        });
    }

    getTotalIssuesByState(state) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select COUNT(*) from Issue where state = $state', {$state: state},
            (err, row) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(row);
                }          
            });
        })
    }

    getTotalsClosedIssues() {
        return new Promise ((resolve, reject) => {
            this.db.get('Select SUM((julianday(DATE(closed_at)) - julianday(DATE(created_at)))) as TotalGap, COUNT(*) as TotalRows'+
                'from Issues Where state = "closed"',
                (err, row) => {
                    if (err) {
                        reject(err);
                    }else{
                        resolve(row);
                    }          
                });
        })
    }

    listGapFromClosedIssues() {
        return new Promise ((resolve, reject) => {
            this.db.get('Select number, ( julianday(DATE(closed_at)) - julianday(DATE(created_at)) ) as CloseGap'+
                'from Issues Where state = "closed"', 
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }else{
                        resolve(rows);
                    }  
                });
        })
    }
}

module.exports = statisticModel;