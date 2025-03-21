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

app.listen(3000, () =>	console.log('Server	ready'));