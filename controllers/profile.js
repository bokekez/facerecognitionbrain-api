const handleProfileGet = (req, res, db) =>{
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
	// }
}

module.exports = {
	handleProfileGet
}
