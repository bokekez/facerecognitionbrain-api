// KORACI 1. npm init -y 2. npm install nodemon --save-dev
// 3. npm install express --save 4. npm install bodyparser 5. npm install cors
//baza -> npm install knex
// import express from 'express';
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// const register = require('./controllers/register');
// const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
// const image = require('./controllers/image');

res.header("Access-Control-Allow-Origin: *");

const db = knex({
  client: 'pg',
  connection: {
  	connectionString: process.env.DATABASE_URL,
  	ssl: true,
    // host : 'postgresql-amorphous-40499',
    // user : 'postgres',
    // password : 'test',
    // database : 'smartbrain'
  }
});


db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();

app.use(cors())

app.use(bodyParser.json());
// npm install cors


// const database = {
// 	users: [
// 	{
// 		id: '123',
// 		name:'john',
// 		email: 'john@gmail.com',
// 		password: 'cookies',
// 		entries: 0,
// 		joined: new Date()
// 	},
// 	{
// 		id: '124',
// 		name:'sally',
// 		email: 'john@gmail.com',
// 		password: 'bananas',
// 		entries: 0,
// 		joined: new Date()
// 	},
// 	],
// 	login: [{
// 			id: '987',
// 			hash: '',
// 			email: 'john@gmail.com'
// 		}]
// }
app.get('/', (req, res)=>{
	res.send('it is working');
	res.send('success')
})
 

 // app.post('/signin', (res, req) => { signin.handleSignin(req, res, db, bcrypt)})

app.post('/signin', (req, res, hash)=>{
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (isValid){
			return 	db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				console.log(user);
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		} else {
			res.status(400).json('Wrong credentials')
		}
	})
// 	.catch(err => res.status(400).json('Wrong credentials'))
//  // 	bcrypt.compare("Apples", hash, function(err, res) {
// 	// 	 console.log('first guess', res);
// 	// });
// 	//  bcrypt.compare("veggies", hash, function(err, res) {
// 	//  	console.log('second guess', res);
// 	// });
// 	// if (req.body.email === database.users[0].email 
// 	// 	&& req.body.password === database.users[0].password){
// 	// 	res.json(database.users[0]);
// 	// } else{
// 	// 	res.status(400).json('error logging in');
// 	// }

}) 

// app.post('/register', (req, res) => {
// 	register.handleRegister (req, res, db, bcrypt)})


app.post('/register', (req, res) => {
	// console.log(req.body);
	// const { email, name, password } = req.body;
	const email = req.body.email;
	const name = req.body.name;
	// const password = req.body.password;
	const hash = bcrypt.hashSync(password);
	// bcrypt.hash(password, null, null, function(err, hash) {
 //     	console.log(hash);
	// });
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
			.returning('*')
			.insert({
			email: loginEmail[0],
			name: name,
			joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		
	.catch(err => res.status(400).json('unable to register'));
	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	// password: password,
	// 	entries: 0,
	// 	joined: new Date()
	// })
	// console.log(database);
	// console.log('Got body:', req.body);
// 	// res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) =>{ 
	const { id } = req.params;
	// let found = false;
	db.select('*').from('users').where({
		id: id
		})
		.then(user => {
		if (user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('No user found')
		}
		
		// console.log(user[0]);
	})
	.catch(err => res.status(400).json('No user found'))
	// database.users.forEach(user =>{
	// 	if (user.id === id) {
	// 		found = true;
	// 		return res.json(user);
	// 	} 
	// })
	// if (!found) {
	// 	res.status(400).json('Not found')
	 
// })
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

// app.put('/image', (req, res) => { 
// 	const { id } = req.body;
//  	 db('users').where('id', '=', id)
//  	 .increment('entries', 1)
//  	 .returning('entries')
//  	 .then(entries => {
//  	 	res.json(entries[0]);
//  	 })
//  	 .catch(err => res.status(400).json('unable to get entries'))

// 	// let found = false;
// 	// database.users.forEach(user =>{
// 	// 	if (user.id === id) {
// 	// 		found = true;
// 	// 		user.entries++;
// 	// 		return res.json(user.entries);
// 	// 	} 
// 	// })
// // // Load hash from your password DB.
// // bcrypt.compare("bacon", hash, function(err, res) {
// //     // res == true
// // });
// 	// if (!found) {
// 	// 	res.status(400).json('Not found')
// 	// }

// })

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(process.env.PORT || 3000, () =>{
	console.log('app is running on port ${process.env.PORT}');
})

/*
	/ --> res = this is working
	/signin --> POST = success/fail
	/register --> POST = user
	/profile/:userId --> GET = user
	/image --> PUT --> user

*/