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
        isRemoved: false,
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
    isRemoved,
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
        isRemoved,
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

const handleUpdateEvents = (req, res, db) => {
    const { id } = req.params;
    const { isRemoved } = req.body;
  
    db("events")
      .where({ id: id })
      .update({
        isRemoved,
      })
      .returning("*")
      .then((events) => {
        res.json({
          "code": 200,
          "data": {
            "events": events[0]
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
    .leftJoin(
      "eventsecuritymeasures",
      "events.id",
      "eventsecuritymeasures.eventid"
    )
    .groupBy("events.id")
    .then((event) => {
      res.json({
        "code": 200,
        "data": {
          "event": {
            ...event[0],
            recommendedGuestsTotal: event[0].guestlimit * 0.40
          },

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
  .join(
    "category",
    "category.id",
    "events.categoryid",
  )
  .select(
    "events.id",
    "events.name",
    "events.description",
    "category.name AS categoyName",
    "events.guestlimit",
    "events.direction",
    "events.startdate",
    "events.enddate",
    "events.createdat",
    "events.userid",
    "events.isRemoved",
    "events.securityValue",
    "events.securityCategory",
    "events.img",
    "category.img AS categoryImg",
    "category.imgBg AS categoryImgBg",
  )
  .orderBy('id', 'desc')
    .where("isRemoved","=", false )
    .returning("*")
    .then((events) => {
      res.json({
        "code": 200,
        "data": {
          "events": events,
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
  handleUpdateEvents: handleUpdateEvents,
};
