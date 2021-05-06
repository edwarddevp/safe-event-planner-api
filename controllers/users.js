const handleUpdateUser = (req, res, db) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db("users")
    .where({ id: id })
    .update({
      name,
      email,
    })
    .returning("*")
    .then((user) => {
      res.json({
        code: 200,
        data: {
          user: user[0],
        },
        message: "Ok",
        success: true,
      });
    })
    .catch((err) =>
      res.status(500).json({
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

const handleDeleteUser = (req, res, db) => {
  const { id } = req.params;

  // Eliminamos todos los eventos de un usuario, y las medididas de seguridad de cada uno de estos eventos y sus invitados
  // y al final se elimina el usuario
  db.transaction((trx) => {
    // obtenemos todos los eventos de un usuario en un array de ids
    trx("users")
      .select(db.raw("ARRAY_AGG(events.id) as eventsIds"))
      .where("users.id", "=", id)
      .leftJoin("events", "users.id", "events.userid")
      .then((events) => {
        // comprobamos si el usuario tiene eventos
        if (events?.[0]?.eventsids && events?.[0]?.eventsids) {
          // eliminaos todos los invitados y medidas de seguridad de ese evento
          return Promise.all([
            trx("guests")
              .whereIn("guests.eventid", events?.[0]?.eventsids)
              .del(),
            trx("eventsecuritymeasures")
              .whereIn("eventsecuritymeasures.eventid", events?.[0]?.eventsids)
              .del(),
          ]).then(() => {
            // eliminamos todos los eventos del usuario
            return trx("events")
              .where("events.userid", "=", id)
              .del()
              .then(() => {
                //eliminamos el registro de usuario del login
                return trx("login")
                  .where("userid", "=", id)
                  .del()
                  .then(() => {
                    //eliminamos el usuario
                    return trx("users")
                      .where("id", "=", id)
                      .del()
                      .returning("id")
                      .then((userId) => {
                        res.json({
                          code: 200,
                          data: {
                            userId: userId[0],
                          },
                          message: "Ok",
                          success: true,
                        });
                      });
                  });
              });
          });
        } else {
          return trx("users")
            .where("id", "=", id)
            .del()
            .returning("id")
            .then((userId) => {
              res.json({
                code: 200,
                data: {
                  userId: userId[0],
                },
                message: "Ok",
                success: true,
              });
            });
        }
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res.status(500).json({
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

const handlCleanUser = (req, res, db) => {
  const { id } = req.params;

  // Eliminamos todos los eventos de un usuario, y las medididas de seguridad de cada uno de estos eventos y sus invitados
  db.transaction((trx) => {
    // obtenemos todos los eventos de un usuario en un array de ids
    trx("users")
      .select(db.raw("ARRAY_AGG(events.id) as eventsIds"))
      .where("users.id", "=", id)
      .leftJoin("events", "users.id", "events.userid")
      .then((events) => {
        // comprobamos si el usuario tiene eventos
        if (events?.[0]?.eventsids && events?.[0]?.eventsids) {
          // eliminaos todos los invitados y medidas de seguridad de ese evento
          return Promise.all([
            trx("guests")
              .whereIn("guests.eventid", events?.[0]?.eventsids)
              .del(),
            trx("eventsecuritymeasures")
              .whereIn("eventsecuritymeasures.eventid", events?.[0]?.eventsids)
              .del(),
          ]).then(() => {
            // eliminamos todos los eventos del usuario
            return trx("events")
              .where("events.userid", "=", id)
              .del()
              .then(() => {
                res.json({
                  code: 200,
                  data: {
                    user: "success",
                  },
                  message: "Ok",
                  success: true,
                });
              });
          });
        } else {
          res.json({
            success: false,
            code: 400,
            data: {},
            message: "NoEventsToDelete",
          });
        }
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) =>
    res.status(500).json({
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

const handleGetUser = (req, res, db) => {
  const { id } = req.params;

  db("users")
    .where("id", "=", id)
    .returning("*")
    .then((user) => {
      res.json({
        code: 200,
        data: {
          user: user[0],
        },
        message: "Ok",
        success: true,
      });
    })
    .catch((err) =>
      res.status(500).json({
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

const handleGetUsers = (req, res, db) => {
  db("users")
    .returning("*")
    .then((users) => {
      res.json({
        code: 200,
        data: {
          users: users,
        },
        message: "Ok",
        success: true,
      });
    })
    .catch((err) =>
      res.status(500).json({
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
  handleGetUsers: handleGetUsers,
  handleUpdateUser: handleUpdateUser,
  handleGetUser: handleGetUser,
  handleDeleteUser: handleDeleteUser,
  handlCleanUser: handlCleanUser,
};
