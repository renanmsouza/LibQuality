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
        const query = this.db.run('Select * from Owners');

        return query;
    }

    get (id) {
        const query = this.db.run('Select * from Owners where idOwners = $id',{
            $id: id
        });

        return query;
    }

    set (owner) {
        const query = this.db.run('Update Owners set name = $name,'+
            ' avatar = $avatar, url = $url'+
            ' where idOwner = $id'
        ,{
            $id: owner.id,
            $name: owner.name,
            $avatar: owner.avatar,
            $url: owner.url,
        });

        return query;
    }

    post (owner) {
        const query = this.db.run('Insert Into Owners Values($name, $avatar, $url)',{
            $name: owner.name,
            $avatar: owner.avatar,
            $url: owner.url,
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