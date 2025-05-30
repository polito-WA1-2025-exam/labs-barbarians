import express from 'express'
import morgan from 'morgan';
import { DBmanager } from './manageDB.mjs';
import { Order } from './components/order.mjs';
import { Bowl } from './components/bowl.mjs';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
const dbManager = new DBmanager() ;
const app = express() ;

app.use(express.json());
app.use(morgan('dev'));


// Allow requests only from this specific origin, our frontend running on localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));;


passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(username, password, cb) {
  console.log('Login attempt:', username);
  try {
    const user = await dbManager.getUser(username, password); 
    if(!user) {
      console.log('User not found or password mismatch for:', username);
      return cb(null, false, 'Incorrect username or password.');
    }
    console.log('User authenticated:', user);
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { 
  return cb(null, user);
  
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));



app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err)
        return next(err);

      // Send back the user object
      console.log('User logged in:', user);
      return res.status(201).json(user);
    });
  })(req, res, next);
});


app.get('/bowlsLeft/:size', (req, res) =>{
    const size = req.params.size 
    dbManager.bowlsLeft(size)
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
})	
app.use(isLoggedIn);
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

app.get('/api/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ username: req.user.username });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.listen(3000, () =>	console.log('Server	ready'));








