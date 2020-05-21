const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password, confirm_password } = req.body;
  if (!email || !name || !password || !confirm_password) {
    return res.status(400).json('Invalid Form');
  }
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  const isValid = password === confirm_password;
  if (isValid) {
    db.transaction((trx) => {
      trx
        .insert({
          name: req.body.name,
          email: req.body.email,
          joined: new Date(),
        })
        .into('users')
        .returning('*')
        .then((user) => {
          return trx('auth')
            .insert({
              email: user[0].email,
              hash: hash,
              id: user[0].id,
            })
            .then(() => {
              res.json(user);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch((err) => res.status(400).json(err));
  }
};
module.exports = {
  handleRegister: handleRegister,
};
