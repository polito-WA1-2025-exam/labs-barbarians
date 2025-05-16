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
        console.log(`Checking bowls left for size: ${size}`);
        const sql = `SELECT nrBowlsLeft
                     FROM bowls_stock
                     WHERE size = ?`;

        this.db.all(sql, [size], function (err, rows) {
            if (err) {
                console.error(`Database error for size ${size}:`, err);
                reject(err);
            } else if (rows.length === 0) {
                console.warn(`No bowls found for size: ${size}`);
                resolve(new Error(`No bowls found for size: ${size}`));
            } else {
                const currentBowls = rows[0].nrBowlsLeft;
                if (!currentBowls) {
                    console.warn(`No bowls left in stock for size: ${size}`);
                    resolve(currentBowls);
                } else {
                    console.log(`Bowls left for size ${size}: ${currentBowls}`);
                    resolve(currentBowls);
                }
            }
        });
    });
  }

  updateBowlsLeft(size, number) {
    return new Promise((resolve, reject) => {
        console.log(`Updating stock for size ${size}: reducing by ${number}`);
        const sql = `UPDATE bowls_stock 
                     SET nrBowlsLeft = nrBowlsLeft - ? 
                     WHERE size = ?`;
        this.db.run(sql, [number, size], function (err) {
            if (err) {
                console.error("Error updating stock:", err);
                reject(err);
            } else {
                console.log(`Stock updated successfully for size ${size}`);
                resolve("Stock updated successfully");
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

  addOrder(username, order, totalPrice) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            this.db.run("BEGIN TRANSACTION", async (err) => {
                if (err) return reject(err);

                try {
                    let totPrice = totalPrice ?? 0;
                    let totNrBowls = 0;

                    const orderId = await this.createOrder(username);

                    // Map size strings to database keys
                    const sizeMap = {
                        R: "R",
                        M: "M",
                        L: "L",
                    };

                    // Track stock updates for each size
                    const stockUpdates = {};

                    // Step 1: Check availability for all sizes
                    for (const bowl of order.bowls) {
                        console.log(`Processing bowl: ${JSON.stringify(bowl)}`);

                        // Map size to database key
                        const dbSize = sizeMap[bowl.size];
                        if (!dbSize) {
                            throw new Error(`Invalid size: ${bowl.size}`);
                        }

                        const nrLeft = await this.bowlsLeft(dbSize);
                        console.log(`Stock before update for size ${dbSize}: ${nrLeft}`);
                        if (nrLeft < bowl.nrBowls) {
                            throw new Error(`Not enough bowls of size ${bowl.size}`);
                        }

                        // Add to stock updates
                        stockUpdates[dbSize] = (stockUpdates[dbSize] || 0) + bowl.nrBowls;

                        totPrice += bowl.price * bowl.nrBowls;
                        totNrBowls += bowl.nrBowls;
                    }

                    // Step 2: Process the transaction (add bowls to the order)
                    for (const bowl of order.bowls) {
                        const dbSize = sizeMap[bowl.size];
                        await this.addBowl(
                            orderId,
                            dbSize,
                            bowl.base,
                            bowl.proteins,
                            bowl.ingredients,
                            bowl.nrBowls,
                            bowl.price
                        );
                    }

                    // Step 3: Update stock for each size once
                    for (const [size, totalReduction] of Object.entries(stockUpdates)) {
                        console.log(`Updating stock for size ${size}: reducing by ${totalReduction}`);
                        await this.updateBowlsLeft(size, totalReduction);
                    }

                    // Step 4: Update the order totals
                    await this.updateOrder(orderId, totPrice, totNrBowls);

                    this.db.run("COMMIT", (commitErr) => {
                        if (commitErr) return reject(commitErr);
                        resolve({ orderId, username });
                    });
                } catch (err) {
                    console.error("Error during transaction:", err);
                    this.db.run("ROLLBACK", () => reject(err));
                }
            });
        });
    });
  }

  retrieveOrders(username) {
    return new Promise((resolve, reject) => {
      // query DB and return an array of all answers to this question
      const sql = `SELECT * 
                FROM orders
                WHERE userId = ?`;

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

  retrieveBowls(orderId) {
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

 (async () => {
   const resetDB = true; //Set to false in order to keep information in DB 
   const dbManager = new DBmanager();
   if (resetDB) {
     await dbManager
       .recreateDatabase()
       .then((res) => console.log(res))
       .catch((err) => console.error(err));
   }
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
 })();

// export default DBmanager;
