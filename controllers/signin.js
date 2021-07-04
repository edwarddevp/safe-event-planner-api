const handleSignin = (db, bcrypt, jwt) => (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
      "success": false,
      "code": 400,
      "data": {},
      "message": "FormError",
      "errors": {
        "error": [
          "incorrect form submission"
        ]
      }
    });
  }

  db("login")
    .join("users", "users.id", "login.userid")
    .select("users.id", "users.name", "users.email", "login.hash")
    .where("email", "=", email)
    .then((data) => {
      if (data.length) {
        const {hash, ...rest} = data[0];
        const isValid = bcrypt.compareSync(password, hash);
        if (isValid) {
          jwt.sign(
            {user: rest},
            "secretkey",
            {expiresIn: "30 days"},
            (err, token) => {
              res.json({
                code: 200,
                data: {
                  token: token,
                  user: rest
                },
                message: "Ok",
                success: true,
              });
            }
          );
        } else {
          res.status(401).json({
            success: false,
            code: 401,
            data: {},
            message: "PermissionError",
            errors: {
              error: [
                "Error de autenticación credenciales incorrectas"
              ],
            },
          });
        }
      } else {
        res.status(401).json({
          success: false,
          code: 401,
          data: {},
          message: "PermissionError",
          errors: {
            error: [
              "Authentication wrong credentials"
            ],
          },
        });
      }


    })
    .catch((err) =>
      res.status(500).json({
        success: false,
        code: 500,
        data: {},
        message: "Internal Server Error",
        errors: {
          error: [
            err
          ],
        },
      })
    );
};

module.exports = {
  handleSignin: handleSignin,
};
