# Group "barbarians"

## Members
- s347610 KALFF HENRY
- s347369 LÄMSÄ VILHO
- s347514 ODQVIST CARL
- S347636 STATTIN ALICE
- s347367 VIKSTRÖM RASMUS

# Exercise **POKE**

# Lab Journal

(you may update this file to keep track of the progress of your group work, throughout the weeks)


# Database 

## Database tables with examples:

### Users  
| username (Primary Key) | password          |
|------------------------|-------------------|
| henkl453               | ldhg342342ifkh    |
| Alist920               | 210ohf4w0tyigdf   |

### Orders  
| orderID (Primary Key) | userID (References Users.Username) | totPrice | nrBowls |    date    |
|------------------------|-----------------------------------|----------|---------|------------|
| 101010123              | Alist920                          |    29    |    3    | 2025-02-15 |
| 101010124              | Alist920                          |    11    |    1    | 2025-03-01 |

### BowlsOrdered  
| ID (Primary Key) | Order ID (References Orders.OrderID) | Size | Base  |    Protein    |  Ingredients  | nrBowls | Price |
|------------------|--------------------------------------|------|-------|---------------|---------------|---------|-------|
| 1                | 101010123                            |   R  | rice  | ["chicken"]   |["kale",..]    |    2    |  18   |
| 2                | 101010123                            |   M  | salad |["tofu","tuna"]|["advocado",..]|    1    |  11   |

### BowlsStock  
| Size (Primary Key) | nrBowlsLeft | price | nrProteins | nrIngredients |
|--------------------|-------------|-------|------------|---------------|
| R                  |     10      |   9   |     1      |       4       |
| M                  |     8       |  11   |     2      |       4       |
| L                  |     6       |  14   |     3      |       6       |

## Functions for the database
### Description

This project has a SQLite database manager for handling the poke bowl orders, the main functions enables: 
- Registration of new user
- Creating and managing orders
- Checking and updating stock levels
- Storing and retrieving order details

### 

### Functions

#### Creating database tables

async recreateDatabase()
- Recreates all database tables by calling recreateDatabaseTables().
- Drops all existing database tables .
- Recreates all database Tables with the required structure and constraints.
- Initializes default data for bowls_stock table
- OBS! Will remove existing information in the tables.


#### User Management

addUser(username, passwordHash)
- Registers a new user with a hashed password.
- Returns the user ID on success.
- If the username already exists, an error is returned.

authUser(username, passwordHash)
- Authenticates a user by checking if the password hash matches.
- Returns a success message on correct credentials, otherwise rejects.

deleteUser(username)
- Removes a user from the database.
- Returns confirmation if successful.

#### Stock Management
bowlsLeft(size)
- Checks the available stock for a given bowl size.
- Returns the number of bowls left or an error if out of stock.

updateBowlsLeft(size, number)
- Decreases stock by a given amount after an order is placed.
- Returns confirmation if successful.

#### Order Management

createOrder(username)
- Creates a new order for a user.
- Order will not yet contain price or number of bowls
- Returns an order ID for reference.
- OBS! Is only used from function addOrder.

addBowl(orderId, size, base, proteins, ingredients, nrBowls, price)
- Adds an individual bowl to an order.
- OBS! Is only used from function addOrder.

updateOrder(orderId, totPrice, nrBowls)
- Updates the total price and number of bowls in an order.
- OBS! Is only used from function addOrder.

addOrder(username, order)
- Handles a full order transaction:
- Checks stock
- Creates an order
- Adds bowls
- Updates stock
- Finalizes order
- If any step fails, the entire transaction is rolled back.

retriveOrders(username)
- Retrieves all orders placed by a specific user.

retriveBowls(orderId)
- Retrieves all bowls in a given order.

#### Database Transactions
BEGIN TRANSACTION → Starts a transaction.
COMMIT → Saves changes if all operations succeed.
ROLLBACK → Undoes all changes if any step fails.

# Note!

No implementation is made for calculating the correct total price that is added into the orders database. Right now the price is only calculated by adding the price for each bowl. The calculation for each bowl is also not implemented yet!

# API

The following requests should be possible
## Retrieve Data
- authUser
- bowlsLeft
- retrieveOrder
- retrieveBowls

## Push Data
- addUser()
- addOrder()
- addBowl()

## No calls
- deleteUser()