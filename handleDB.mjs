
import sqlite from 'sqlite3'


function DBmanager() {
        
    const db = new sqlite.Database('poke.sqlite', (err) => { if (err) throw err});  

    this.addUser = (username,passwordHash) => {
        this.username = username;
        this.passwordHash = passwordHash;
        return new Promise((resolve, reject) => {
            const sql =
                `INSERT INTO users(username, passwordHash)
                VALUES (?,?)`
                
            db.run(sql, [this.username, this.passwordHash], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, username: username });
                }
                });
            });
        };
    
    this.authUser = (username,passwordHash) => {
        this.username = username;
        this.passwordHash = passwordHash;
        return new Promise((resolve, reject) => {
            // query DB and return an array of all answers to this question
            const sql =
                `SELECT * 
                FROM users
                WHERE username = ?`   

            db.all(sql, [this.username], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                
                    console.log(rows)
                   
                }
            })

        })
    }
}

const user = new DBmanager().authUser("alice", "fbvksfvb")
 
    
