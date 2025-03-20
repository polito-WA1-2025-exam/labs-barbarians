import sqlite from 'sqlite3'

const db_init = new sqlite.Database('poke.sqlite', (err) => { if (err) throw err});
// Function for removing the database tables

const deleteDatabaseTables = () => {
    return new Promise((resolve,reject) => {
        db_init.serialize(() => {
            db_init.run(`DROP TABLE IF EXISTS users`, (err) => {
                if (err) reject(err);
            });
            db_init.run(`DROP TABLE IF EXISTS orders`, (err) => {
                if (err) reject(err);
            });
            db_init.run(`DROP TABLE IF EXISTS bowls_ordered`, (err) => {
                if (err) reject(err);
            });
            db_init.run(`DROP TABLE IF EXISTS bowls_stock`, (err) => {
                if (err) reject(err);
            });

            resolve();
        });
    });
}

// Function for creating the database tables

const createDatabaseTables = () => {
    return new Promise((resolve, reject) => {
        db_init.serialize(() => {
            db_init.run(`CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                passwordHash TEXT NOT NULL
            )`, (err) => {
                if (err) reject(err);
            });

            db_init.run(`CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT,
                totPrice INTEGER NOT NULL,
                nrBowls INTEGER NOT NULL,
                date TEXT NOT NULL,
                FOREIGN KEY(userId) REFERENCES users(username)
            )`, (err) => {
                if (err) reject(err);
            });

            db_init.run(`CREATE TABLE IF NOT EXISTS bowls_ordered (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                orderId INTEGER,
                size TEXT NOT NULL,
                base TEXT NOT NULL,
                proteins TEXT NOT NULL,
                ingredients TEXT NOT NULL,
                nrBowls TEXT NOT NULL,
                price INTEGER NOT NULL,
                FOREIGN KEY(orderId) REFERENCES orders(id)
            )`, (err) => {
                if (err) reject(err);
            });

            db_init.run(`CREATE TABLE IF NOT EXISTS bowls_stock (
                size TEXT PRIMARY KEY,
                nrBowlsLeft INTEGER NOT NULL,
                price INTEGER NOT NULL,
                nrProteins INTEGER NOT NULL,
                nrIngredients INTEGER NOT NULL
            )`, (err) => {
                if (err) reject(err);
            });
            resolve();
        });
    });
}



// Function for reinitalizing the database tables

export async function recreateDatabaseTables() {
await deleteDatabaseTables();
await createDatabaseTables();

await new Promise((resolve, reject) => {
    db_init.run(`INSERT INTO bowls_stock(size, nrBowlsLeft, price, nrProteins, nrIngredients)
        VALUES 
        ("R", 10 ,9 , 1, 4),
        ("M", 8 ,11 , 2, 4),
        ("L", 6 ,14 , 3, 6);
    `, (err) => {
        if (err) reject(err);
        else resolve();
    });
});
console.log("Database tables have been recreated");
}

//Used to reset the database tables if wanted (and to create them first time running)

//recreateDatabaseTables()

