const sqlite3 = require('sqlite3').verbose();

class statisticModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (e) => {
            if (e) {
                console.log(e);
            }
        });
    }

    destroy() {
        this.db.close();
    }

    listByProject(idProjects) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select * from Statistics Where idProjects = $idProjects', 
            {
                $idProjects: idProjects
            }, 
            (err, rows) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(rows);
                }  
            });
            
        })
    }

    post (objs) {
        return new Promise((resolve, reject) => {
            this.db.run('begin transaction;'); 
            for (let i = 0; i < objs.length; i++) {
                let obj = objs[i];
                this.db.run('Insert into Statistics values(null, $idProjects, $calculationDate, $openIssues, $closeIssues, $avgAge, $stdAge)',
                {
                    $idProjects: obj.idProjects,
                    $calculationDate: obj.calculationDate,
                    $openIssues: obj.openIssues,
                    $closeIssues: obj.closeIssues,
                    $avgAge: obj.avgAge,
                    $stdAge: obj.stdAge
                });
            }
            this.db.run('end;', 
            (err) => {
                if (err) {
                    reject({ error: err });
                }else{
                    resolve(true);
                }     
            });
            
        })
    }

    getTotalIssuesByState(idProjects, state) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select COUNT(*) total from Issues Where idProjects = $idProjects and state = $state', 
            {
                $idProjects: idProjects,
                $state: state
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

    getInfosClosedIssues(idProjects) {
        return new Promise ((resolve, reject) => {
            this.db.get('Select SUM((julianday(DATE(closed_at)) - julianday(DATE(created_at)))) as TotalGap, COUNT(*) as TotalRows'+
                ' from Issues Where idProjects = $idProjects and state = "closed"', { $idProjects: idProjects },
            (err, row) => {
                if (err) {
                    reject(err);
                }else{
                    resolve(row);
                }          
            });
            
        })
    }

    listGapFromClosedIssues(idProjects) {
        return new Promise ((resolve, reject) => {
            this.db.all('Select idIssues, ( julianday(DATE(closed_at)) - julianday(DATE(created_at)) ) as CloseGap'+
                ' from Issues Where idProjects = $idProjects and state = "closed"', { $idProjects: idProjects }, 
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