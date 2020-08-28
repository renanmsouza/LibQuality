const sqlite3 = require('sqlite3').verbose();

class ownerModel {
    constructor() {
        this.db = new sqlite3.Database('../database/libquality.sqlite3', (e) => {
            if (e) {
                console.log(e);
            }
        });
    }

    list () {
        this.db.run("SELECT * FROM Owners", (err, rows) => {
            if(!err) {
                return rows;
            }else{
                return err;
            }
        });
    }

    get (id) {
        const query = this.db.run('Select * from Owners where idOwners = $id',{
            $id: id
        });

        return query;
    }

    set (owner) {
        const query = this.db.run('Update Owners set name = $name,'+
            ' avatar = $avatar, url = $url, type = $type'+
            ' where idOwners = $idOwners'
        ,{
            $idOwners: owner.idOwners,
            $name: owner.name,
            $avatar: owner.avatar,
            $url: owner.url,
            $type: owner.type
        });

        return query;
    }

    post (owner) {
        console.log(owner);
        const query = this.db.run('INSERT INTO Owners VALUES($idOwners, $name, $avatar, $url, $type)',{
            $idOwners: owner.idOwners,
            $name: owner.name,
            $avatar: owner.avatar,
            $url: owner.url,
            $type: owner.type
        });

        return query;
    }

    del (id) {
        const query = this.db.run('Delete from Owners where idOwners = $id',{
            $id: id
        });

        return query;
    }
}

module.exports = ownerModel;