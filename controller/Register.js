const handleRegister = (req, res,db,bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
      return res.status(400).json('please fill in all fields');
    } 
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*') 
            .insert({
                email: email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
                })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    
    .catch(err => res.status(400).json({message: 'unable to register', error: err}))

};

module.exports = {
    handleRegister: handleRegister
}