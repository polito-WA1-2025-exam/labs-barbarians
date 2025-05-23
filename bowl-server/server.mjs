import express from 'express'
import morgan from 'morgan';
import { DBmanager } from './manageDB.mjs';
import { Order } from './components/order.mjs';
import { Bowl } from './components/bowl.mjs';
import cors from 'cors';
const dbManager = new DBmanager() ;
const app = express() ;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/user/auth/:username/:passwordHash', (req, res) =>	{
    dbManager.authUser(req.params.username, req.params.passwordHash).then( _ => res.send('User authenticated')).catch(err => res.send("User not authenticated")) ;
}) ;

app.get('/bowlsLeft/:size', (req, res) =>{
    const size = req.params.size 
    dbManager.bowlsLeft(size)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
})	

app.get('/bowlsAvailability', (req, res) => {
    const sizes = ["R", "M", "L"];
    const promises = sizes.map(size => 
        dbManager.bowlsLeft(size)
            .then(count => ({ size, count }))
            .catch(err => {
                console.error(`Error fetching bowls for size ${size}:`, err);
                throw err;
            })
    );

    Promise.all(promises)
        .then(results => res.json(results))
        .catch(err => {
            console.error("Error in /bowlsAvailability:", err);
            res.status(500).json({ error: "Error fetching bowl availability", details: err.message });
        });
});

app.post('/addUser', (req,res) => {
    const {username, passwordHash} = req.body ;

    console.log("Received:", username, passwordHash);
    
    dbManager.addUser(username, passwordHash)
        .then(user => res.json(user)) // Send back the inserted user info
        .catch(err => {
            console.error("Error adding user:", err);
            res.status(500).json({ error: "User already exists or DB error" });
        });
})

app.get('/user/:username/retrieveOrders', (req, res) => {
    dbManager.retrieveOrders(req.params.username).then(orders => res.send(orders)).catch(err => res.send(err)) ;
}) 

app.get('/user/:username/:orderId/retrieveBowls', (req, res) => {
    dbManager.retrieveBowls(req.params.orderId).then(bowls => res.send(bowls)).catch(err => res.send(err)) ; 
})

app.post('/addOrder', (req, res) => {
    console.log("full body", req.body);
    const { username, order, totalPrice } = req.body;

    dbManager.addOrder(username, order, totalPrice)
        .then(order => res.json(order))
        .catch(err => {
            console.error("Error adding order:", err); // Check this log
            res.status(500).json({ error: "DB error" });
        });
});

app.post('/addBowls/', (req, res) => {
    const {orderId, size, base, proteins, ingredients, nrBowls, price} = req.body ;

    dbManager.addBowl(orderId, size, base, proteins, ingredients, nrBowls, price).then( _ => res.send('Bowls added')).catch(err => res.send(err)) ;
});

app.listen(3000, () =>	console.log('Server	ready'));








