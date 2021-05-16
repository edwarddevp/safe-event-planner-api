const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      code: 400,
      data: {},
      message: "FormError",
      errors: {
        error: ["incorrect form submission"],
      },
    });
  }
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        name: name,
        createdat: new Date(),
      })
      .into("users")
      .returning("*")
      .then((user) => {
        return trx
          .insert({
            hash: hash,
            userid: user[0]?.id,
          })
          .into("login")
          .then(() => {
            res.json({
              code: 200,
              data: {
                user: user[0],
              },
              message: "Ok",
              success: true,
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    err?.detail.includes("already exists")?
     res.status(400).json({
          success: false,
          code: 400,
          data: {},
          message: "FormError",
          errors: {
            error: ["There is already an account with the email provided"],
          },
        })
      : res.status(500).json({
          success: false,
          code: 500,
          data: {},
          message: "Internal Server Error",
          errors: {
            error: [err],
          },
        })
  );
};

module.exports = {
  handleRegister: handleRegister,
};
