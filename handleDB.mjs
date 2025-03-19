
import sqlite from 'sqlite3'
import { recreateDatabaseTables } from './createDB.mjs';


class DBmanager {

    constructor() {
        
    }

    async initDBmanager() {
        try {
            this.db = await recreateDatabaseTables();
            console.log("Database tables created successfully.");
        } catch (error) {
            console.error("Error recreating database tables:", error);
        }
        // this.db = new sqlite.Database('poke.sqlite', (err) => {
        //     if (err) throw err;
        //     console.log("Connected to database.");
        // });
    }

    addUser(username,passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
        console.log("added user!!")
        return new Promise((resolve, reject) => {
            const sql =
                `INSERT INTO users(username, passwordHash)
                VALUES (?,?)`
                
            this.db.run(sql, [this.username, this.passwordHash], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, username: username });
                }
                });
            });
        };
    
    authUser(username,passwordHash) {
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
                } else if(!rows[0].passwordHash=== this.passwordHash) {
                    reject("Wrong password or username!")
                }else{
                    resolve("Sign in :)")
                }
            })

        })
    }

    closeDBmanager() {
        this.db.close();
    }
}

(async () => {
    const dbManager = new DBmanager();

    await dbManager.initDBmanager();

    await dbManager.addUser("user4", "abc123").then(console.log("user added"))
    .then((res) => console.log("User added:", res))
    .catch((err) => console.error("Error adding user:", err));

    //dbManager.close()

});



 
