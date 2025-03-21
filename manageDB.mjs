import sqlite from "sqlite3";
import dayjs from "dayjs";

import { recreateDatabaseTables } from "./createDB.mjs";

export class DBmanager {
  constructor() {
    this.db = new sqlite.Database("poke.sqlite", async (err) => {
      if (err) {
        console.error("Error opening database:", err);
        throw err;
      }
      console.log("Connected to database");
    });
  }

  async recreateDatabase() {
    try {
      await recreateDatabaseTables();
    } catch (error) {
      console.error("Error recreating database tables:", error);
    }
  }

  addUser(username, passwordHash) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users(username, passwordHash) 
                    VALUES (?,?)`;

      this.db.run(sql, [username, passwordHash], function (err) {
        if (err) {
          console.log("User already exists!");
          reject(err);
        } else resolve({ id: this.lastID, username });
      });
    });
  }

  authUser(username, passwordHash) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * 
                FROM users
                WHERE username = ?`;

      this.db.all(sql, [username], (err, rows) => {
        console.log(rows.length);
        if (err) {
          reject(err);
        } else if (rows.length === 0 || rows[0].passwordHash !== passwordHash) {
          reject("Wrong password or username!");
        } else {
          resolve("Sign in :)");
        }
      });
    });
  }

  deleteUser(username) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM users
            WHERE username = ?`;

      this.db.run(sql, [username], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("User removed");
        }
      });
    });
  }

  bowlsLeft(size) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT nrBowlsLeft
                FROM bowls_stock
                WHERE size = ?`;

      this.db.all(sql, [size], function (err, rows) {
        if (err) {
          reject(err);
        } else if (!rows) {
          reject("Size not found in stock!");
        }
        const currentBowls = rows[0].nrBowlsLeft;
        if (!currentBowls) {
          reject(`No bowls left in stock of size ${size}!`);
        } else {
          console.log(`There are ${currentBowls} bowls left of size ${size}`);
          resolve(currentBowls);
        }
      });
    });
  }

  updateBowlsLeft(size, number) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE bowls_stock 
            SET nrBowlsLeft = nrBowlsLeft - ? 
            WHERE size = ?`;
      this.db.run(sql, [number, size], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("Bowls has been ordered"); // Returning the number of rows changed
        }
      });
    });
  }

  createOrder(username) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO orders(userId, totPrice, nrBowls, date)
                VALUES (?,?,?,?)`;
      this.db.run(sql, [username, 0, 0, dayjs().format()], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  updateOrder(id, totPrice, nrBowls) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE orders 
                SET totPrice = totPrice + ?,
                nrBowls = nrBowls + ?
                WHERE id = ?`;
      this.db.run(sql, [totPrice, nrBowls, id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: id });
        }
      });
    });
  }

  addBowl(orderId, size, base, proteins, ingredients, nrBowls, price) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO bowls_ordered(orderId, size, base, proteins, ingredients, nrBowls, price)
                VALUES (?,?,?,?,?,?,?)`;
      this.db.run(
        sql,
        [orderId, size, base, JSON.stringify(proteins), JSON.stringify(ingredients), nrBowls, price],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: orderId });
          }
        }
      );
    });
  }

  addOrder(username, order) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Start the transaction
        this.db.run("BEGIN TRANSACTION", async (err) => {
          if (err) return reject(err);

          try {
            let totPrice = 0;
            let totNrBowls = 0;

            // Create order and get the orderId
            const orderId = await this.createOrder(username);
            

            // Process all bowls in parallel
            await Promise.all(
              order.map(async (bowl) => {
                const nrLeft = await this.bowlsLeft(bowl.size);
                if (nrLeft < bowl.nrBowls) {
                  throw new Error(`Not enough bowls of size ${bowl.size}`);
                }

                await this.addBowl(
                  orderId,
                  bowl.size,
                  bowl.base,
                  bowl.proteins,
                  bowl.ingredients,
                  bowl.nrBowls,
                  bowl.price
                );

                await this.updateBowlsLeft(bowl.size, nrLeft - bowl.nrBowls);

                totPrice += bowl.price;
                totNrBowls += bowl.nrBowls;
              })
            );

            // Update the order with final totals
            await this.updateOrder(orderId, totPrice, totNrBowls);

            // Commit the transaction
            this.db.run("COMMIT", (commitErr) => {
              if (commitErr) return reject(commitErr);
              resolve({ orderId, username });
            });
          } catch (err) {
            // Rollback transaction on any error
            this.db.run("ROLLBACK", () => reject(err));
          }
        });
      });
    });
  }

  retriveOrders(username) {
    return new Promise((resolve, reject) => {
      // query DB and return an array of all answers to this question
      const sql = `SELECT * 
                FROM orders
                WHERE username = ?`;

      this.db.all(sql, [username], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          reject("Not a user!");
        } else {
          resolve(rows);
        }
      });
    });
  }

  retriveBowls(orderId) {
    return new Promise((resolve, reject) => {
      // query DB and return an array of all answers to this question
      const sql = `SELECT * 
                FROM bowls_ordered
                WHERE orderId = ?`;

      this.db.all(sql, [orderId], (err, rows) => {
        console.log(rows.length);
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          reject("Not an order!");
        } else {
          resolve(rows);
        }
      });
    });
  }

  closeDBmanager() {
    this.db.close();
  }
}

// (async () => {
//   const resetDB = true; //Set to false in order to keep information in DB 
//   const dbManager = new DBmanager();
//   if (resetDB) {
//     await dbManager
//       .recreateDatabase()
//       .then((res) => console.log(res))
//       .catch((err) => console.error(err));
//   }
//   await dbManager
//     .addUser("user5", "cba321")
//     .then((res) => console.log("User added:", res))
//     .catch((err) => console.error("Error adding user:", err));

//   await dbManager
//     .addUser("user2", "cba321")
//     .then((res) => console.log("User added:", res))
//     .catch((err) => console.error("Error adding user:", err));

//   await dbManager
//     .addUser("user4", "abc123")
//     .then((msg) => console.log(msg))
//     .catch((err) => console.error(err));

//   await dbManager
//     .authUser("user4", "abc123")
//     .then((msg) => console.log(msg))
//     .catch((err) => console.error(err));
//   /*
// Only used all the function when creating them, will not be used directly later
//   await dbManager
//     .createOrder("user5", 17, 1)
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));
//   await dbManager
//     .bowlsLeft("R")
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));

//   await dbManager
//     .updateOrder(5, 13, 2)
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));
//   await dbManager
//     .addBowl(5, "R", "rice", "[tuna,tune]", "[kale, kale, kale]", 1, 12)
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));
// */
//   await dbManager
//     .deleteUser("user4")
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));

//   const order = [
//     {
//       size: "R",
//       base: "rice",
//       proteins: ["chicken"],
//       ingredients: ["kale", "salad"],
//       nrBowls: 2,
//       price: 9,
//     },
//     {
//       size: "M",
//       base: "noodles",
//       proteins: ["beef"],
//       ingredients: ["kale", "salad", "avocado"],
//       nrBowls: 3,
//       price: 11,
//     },
//     {
//       size: "L",
//       base: "quinoa",
//       proteins: ["salmon", "tuna"],
//       ingredients: ["kale", "avocado"],
//       nrBowls: 1,
//       price: 14,
//     },
//   ];
//   await dbManager
//     .addOrder("user5", order)
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));

//   await dbManager
//     .retriveOrders("user5")
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));

//   await dbManager
//     .retriveBowls(1)
//     .then((res) => console.log(res))
//     .catch((err) => console.error(err));

//   dbManager.closeDBmanager();
// })();

// export default DBmanager;
