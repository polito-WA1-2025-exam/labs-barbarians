import sqlite from 'sqlite3'
import { recreateDatabaseTables } from './createDB2.mjs'

class DBmanager {
    constructor() {}

    async initDBmanager() {
        try {
            this.db = await recreateDatabaseTables();
            console.log("Database tables created successfully.");
        } catch (error) {
            console.error("Error recreating database tables:", error);
        }
    }

    addUser(username, passwordHash) {
        return new Promise((resolve, reject) => {
            const sql = 
                `INSERT INTO users(username, passwordHash) 
                VALUES (?,?)`;

            this.db.run(sql, [username, passwordHash], function(err) {
                if (err) 
                    reject(err);
                else 
                    resolve({ id: this.lastID, username });
            });
        });
    }

    authUser(username, passwordHash) {
        return new Promise((resolve, reject) => {
            const sql = 
            `SELECT * 
            FROM users 
            WHERE username = ?`;
            
            this.db.all(sql, [username], (err, rows) => {
                if (err) reject(err);
                else if (rows.length === 0 || rows[0].passwordHash !== passwordHash) {
                    reject("Wrong password or username!");
                } else {
                    resolve("Sign in successful :)");
                }
            });
        });
    }

    closeDBmanager() {
        this.db.close();
    }
}

(async () => {
    const dbManager = new DBmanager();

    await dbManager.initDBmanager();

    await dbManager.addUser("user5", "cba321")
        .then((res) => console.log("User added:", res))
        .catch((err) => console.error("Error adding user:", err));

    // Test authentication (optional)
    await dbManager.authUser("user4", "abc123")
        .then(msg => console.log(msg))
        .catch(err => console.error(err));

    dbManager.closeDBmanager();
})();
