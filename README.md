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



# Database tables with examples:

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

