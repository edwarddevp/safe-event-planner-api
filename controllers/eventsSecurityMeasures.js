const handleGetEventSecurityMeasures = (req, res, db) => {
  const { eventId } = req.params;

  db("eventsecuritymeasures")
    .select("securitymeasuresid")
    .where("eventid", "=", eventId)
    .then((securityMeasures) => {
      res.json({
        code: 200,
        data: {
          securityMeasure: securityMeasures
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

const handleToggleEventSecurityMeasures = (req, res, db) => {
  const { eventId, id } = req.params;

  db("eventsecuritymeasures")
    .where({ eventid: eventId, securitymeasuresid: id })
    .then((securityMeasures) => {
      if (securityMeasures?.[0]?.id) {
        db("eventsecuritymeasures")
          .where({ eventid: eventId, securitymeasuresid: id })
          .del()
          .then(() => {
            res.json({
              code: 200,
              data: {
                securityMeasure: false,
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
      } else {
        db("eventsecuritymeasures")
          .insert({ eventid: eventId, securitymeasuresid: id })
          .then(() => {
            res.json({
              code: 200,
              data: {
                securityMeasure: true,
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
      }
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

const handleSetEventSecurityMeasures = (req, res, db) => {
  const { eventId } = req.params;
  const { securityMeasureIds } = req.body;

  db.transaction((trx) => {
    trx("eventsecuritymeasures")
      .where({ eventid: eventId })
      .del()
      .then(() => {
        return trx("eventsecuritymeasures")
          .insert(
            securityMeasureIds?.map((securityMeasureId) => ({
              securitymeasuresid: securityMeasureId,
              eventid: eventId,
            }))
          )
          .then((data) => {
            res.json({
              code: 200,
              data: {
                securityMeasureIds: securityMeasureIds,
              },
              message: "Ok",
              success: true,
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })          .catch((err) =>
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
  handleGetEventSecurityMeasures: handleGetEventSecurityMeasures,
  handleToggleEventSecurityMeasures: handleToggleEventSecurityMeasures,
  handleSetEventSecurityMeasures: handleSetEventSecurityMeasures,
};
