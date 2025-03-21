import express from 'express'
import morgan from 'morgan';
import { DBmanager } from './manageDB.mjs';

const dbManager = new DBmanager() ;
const app = express() ;

app.use(express.json());
app.use(morgan('dev'));

app.get('/user/auth/:username/:passwordHash', (req, res) =>	{
    dbManager.authUser(req.params.username, req.params.passwordHash).then( _ => res.send('User authenticated')).catch(err => res.send("User not authenticated")) ;
}) ;

app.get('/bowlsLeft/:size', (req, res) =>{
    const size = req.params.size 
    dbManager.bowlsLeft(size)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
})	

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
    dbManager.retriveOrders(req.params.username).then(orders => res.send(orders)).catch(err => res.send(err)) ;
}) 

app.get('/user/:username/:orderId/retrieveBowls', (req, res) => {
    dbManager.retriveBowls(req.params.orderId).then(bowls => res.send(bowls)).catch(err => res.send(err)) ; 
})

app.listen(3000, () =>	console.log('Server	ready'));



 




