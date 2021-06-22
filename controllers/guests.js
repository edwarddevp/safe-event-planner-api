const handleCreateGuest = (req, res, db) => {
  const { eventId } = req.params;
  const { body } = req;
  const { name, email, phone } = body;

  if (!name || !email) {
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

  db.transaction((trx) => {
    trx
      .insert({ name, email, phone, eventid: eventId })
      .into("guests")
      .returning("*")
      .then((guest) => {
        res.json({
          "code": 200,
          "data": {
            "guest": guest[0]
          },
          "message": "Ok",
          "success": true
      });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })    .catch((err) => res.status(500).json({
      "success": false,
      "code": 500,
      "data": {},
      "message": "Internal Server Error",
      "errors": {
          "error": [
            err
          ]
      }
  }));
};

const handleUpdateGuest = (req, res, db) => {
  const { eventId } = req.params;
  const { id } = req.params;
  const { name, email, phone } = req.body;

  db("guests")
    .where({ id: id, eventid: eventId })
    .update({
      name,
      email,
      phone,
    })
    .returning("*")
    .then((guest) => {
      res.json({
        "code": 200,
        "data": {
          "guest": guest[0]
        },
        "message": "Ok",
        "success": true
    });
    })
        .catch((err) => res.status(500).json({
      "success": false,
      "code": 500,
      "data": {},
      "message": "Internal Server Error",
      "errors": {
          "error": [
            err
          ]
      }
  }));
};

const handleDeleteGuest = (req, res, db) => {
  const { eventId } = req.params;
  const { id } = req.params;

  db("guests")
    .where({ id: id, eventid: eventId })
    .del()
    .returning("id")
    .then((guestId) => {
      res.json({
        "code": 200,
        "data": {
          "guestId": guestId[0] 
        },
        "message": "Ok",
        "success": true
    });
    })
        .catch((err) => res.status(500).json({
      "success": false,
      "code": 500,
      "data": {},
      "message": "Internal Server Error",
      "errors": {
          "error": [
            err
          ]
      }
  }));
};

const handleGetGuest = (req, res, db) => {
  const { eventId } = req.params;
  const { id } = req.params;

  db("guests")
    .where({ id: id, eventid: eventId })
    .returning("*")
    .then((guest) => {
      res.json({
        "code": 200,
        "data": {
          "guest": guest[0]
        },
        "message": "Ok",
        "success": true
    });
    })
    .catch((err) => res.status(500).json({
      "success": false,
      "code": 500,
      "data": {},
      "message": "Internal Server Error",
      "errors": {
          "error": [
            err
          ]
      }
  }));
};

const handleGetGuests = (req, res, db) => {
  const { eventId } = req.params;

  db("guests")
  .orderBy('id', 'desc')
  
    .where({eventid: eventId})
    .returning("*")
    .then((guests) => {
      res.json({
        "code": 200,
        "data": {
          "guests": guests
        },
        "message": "Ok",
        "success": true
    });
    })
    .catch((err) => res.status(500).json({
      "success": false,
      "code": 500,
      "data": {},
      "message": "Internal Server Error",
      "errors": {
          "error": [
            err
          ]
      }
  }));
};

module.exports = {
  handleGetGuests: handleGetGuests,
  handleGetGuest: handleGetGuest,
  handleCreateGuest: handleCreateGuest,
  handleUpdateGuest: handleUpdateGuest,
  handleDeleteGuest: handleDeleteGuest,
};
