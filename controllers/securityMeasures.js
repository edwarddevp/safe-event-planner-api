const handleCreateSecurityMeasure = (req, res, db) => {
  const { body } = req;
  const { name, description, value } = body;

  if (!name || !value) {
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

  db.transaction((trx) => {
    trx
      .insert({
        name,
        description,
        value,
      })
      .into("securitymeasures")
      .returning("*")
      .then((securityMeasures) => {
        res.json({
          code: 200,
          data: {
            securityMeasure: securityMeasures[0],
          },
          message: "Ok",
          success: true,
        });
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

const handleUpdateSecurityMeasure = (req, res, db) => {
  const { id } = req.params;
  const { name, description, value } = req.body;

  db("securitymeasures")
    .where({ id: id })
    .update({
      name,
      description,
      value,
    })
    .returning("*")
    .then((securityMeasures) => {
      res.json({
        code: 200,
        data: {
          securityMeasure: securityMeasures[0],
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

const handleDeleteSecurityMeasure = (req, res, db) => {
  const { id } = req.params;

  db("securitymeasures")
    .where("id", "=", id)
    .del()
    .returning("id")
    .then((securityMeasuresId) => {
      res.json({
        code: 200,
        data: {
          securityMeasuresId: securityMeasuresId[0],
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

const handleGetSecurityMeasure = (req, res, db) => {
  const { id } = req.params;

  db("securitymeasures")
    .where("id", "=", id)
    .returning("*")
    .then((securityMeasures) => {
      res.json({
        code: 200,
        data: {
          securityMeasure: securityMeasures[0],
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

const handleGetSecurityMeasures = (req, res, db) => {
  db("securitymeasures")
    .returning("*")
    .then((securityMeasures) => {
      res.json({
        code: 200,
        data: {
          securityMeasures: securityMeasures,
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
  handleGetSecurityMeasures: handleGetSecurityMeasures,
  handleGetSecurityMeasure: handleGetSecurityMeasure,
  handleCreateSecurityMeasure: handleCreateSecurityMeasure,
  handleUpdateSecurityMeasure: handleUpdateSecurityMeasure,
  handleDeleteSecurityMeasure: handleDeleteSecurityMeasure,
};
