const handleCreateEvent = (req, res, db) => {
  const { session, body } = req;
  const {
    name,
    description,
    guestlimit,
    direction,
    startdate,
    enddate,
    categoryid,
    securityMeasureIds,
  } = body;

  if (!name || !startdate || !enddate) {
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
      .insert({
        name,
        description,
        guestlimit,
        direction,
        startdate,
        enddate,
        categoryid,
        createdat: new Date(),
        userid: session.user.id,
        isactive: true,
      })
      .into("events")
      .returning("*")
      .then((event) => {
        if (securityMeasureIds && securityMeasureIds.length) {
          // insert security measures
          return trx("eventsecuritymeasures")
            .where({ eventid: event?.[0]?.id })
            .del()
            .then(() => {
              return trx("eventsecuritymeasures")
                .insert(
                  securityMeasureIds?.map((securityMeasureId) => ({
                    securitymeasuresid: securityMeasureId,
                    eventid: event?.[0]?.id,
                  }))
                )
                .then((data) => {
                  res.json({
                    "code": 200,
                    "data": {
                      "events": event[0]
                    },
                    "message": "Ok",
                    "success": true
                });
                });
            });
        } else {
          res.json({
            "code": 200,
            "data": {
              "events": event[0]
            },
            "message": "Ok",
            "success": true
        });
        }
      })
      .then(trx.commit)
      .catch(trx.rollback);
    }).catch((err) => res.status(500).json({
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

const handleUpdateEvent = (req, res, db) => {
  const { id } = req.params;
  const {
    name,
    description,
    guestlimit,
    direction,
    startdate,
    enddate,
    categoryid,
    isActive,
    securityMeasureIds,
  } = req.body;

  db.transaction((trx) => {
    trx("events")
      .where({ id: id })
      .update({
        name,
        description,
        guestlimit,
        direction,
        startdate,
        enddate,
        categoryid,
        isActive,
      })
      .returning("*")
      .then((event) => {
        if (securityMeasureIds && securityMeasureIds.length) {
          // insert security measures
          return trx.transaction((trx) => {
            trx("eventsecuritymeasures")
              .where({ eventid: event?.[0]?.id })
              .del()
              .then(() => {
                return trx("eventsecuritymeasures")
                  .insert(
                    securityMeasureIds?.map((securityMeasureId) => ({
                      securitymeasuresid: securityMeasureId,
                      eventid: event?.[0]?.id,
                    }))
                  )
                  .then((data) => {
                    res.json({
                      "code": 200,
                      "data": {
                        "events": event[0]
                      },
                      "message": "Ok",
                      "success": true
                  });
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
        } else {
          res.json({
            "code": 200,
            "data": {
              "events": event[0]
            },
            "message": "Ok",
            "success": true
        });
        }
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(500).json({
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

const handleDeleteEvent = (req, res, db) => {
  const { id } = req.params;

  db("events")
    .where("id", "=", id)
    .del()
    .returning("id")
    .then((eventId) => {
      res.json({
        "code": 200,
        "data": {
          "eventId": eventId[0]
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

const handleGetEvent = (req, res, db) => {
  const { id } = req.params;

  db("events")
    .where("events.id", "=", id)
    .select([
      "events.*",
      db.raw(
        "ARRAY_AGG(eventsecuritymeasures.securitymeasuresid) as securitymeasuresids"
      ),
    ])
    .innerJoin(
      "eventsecuritymeasures",
      "events.id",
      "eventsecuritymeasures.eventid"
    )
    .groupBy("events.id")

    .then((event) => {
      res.json({
        "code": 200,
        "data": {
          "events": event[0]
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

const handleGetEvents = (req, res, db) => {
  const { session } = req;

  db("events")
    .where("userid", "=", session.user.id)
    .returning("*")
    .then((events) => {
      res.json({
        "code": 200,
        "data": {
          "events": events
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
  handleCreateEvent: handleCreateEvent,
  handleUpdateEvent: handleUpdateEvent,
  handleGetEvents: handleGetEvents,
  handleGetEvent: handleGetEvent,
  handleDeleteEvent: handleDeleteEvent,
};
