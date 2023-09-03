const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
      return trx
        .insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(email => {
          return trx('users')
            .returning('*')
            .insert({
              email: email[0],
              name: name,
              joined: new Date()
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => {
      res.status(400).json({ message: 'Unable to register', error: err });
    });
  };
  
  module.exports = {
    handleRegister: handleRegister
  };
  