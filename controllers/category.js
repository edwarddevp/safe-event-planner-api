const handleCreateCategory = (req, res, db) => {
  const { body } = req;
  const { name } = body;

  if (!name) {
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

  db.insert({ name })
    .into("category")
    .returning("*")
    .then((category) => {
      res.json({
        "code": 200,
        "data": {
          "category": category[0]
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

const handleUpdateCategory = (req, res, db) => {
  const { id } = req.params;
  const {name} = req.body;

  db("category")
    .where({ id: id })
    .update({name})
    .returning("*")
    .then((category) => {
      res.json({
        "code": 200,
        "data": {
          "category": category[0]
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

const handleDeleteCategory = (req, res, db) => {
  const { id } = req.params;

  db("category")
    .where("id", "=", id)
    .del()
    .returning("id")
    .then((categoryId) => {
      res.json({
        "code": 200,
        "data": {
          "categoryId:": categoryId[0]
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

const handleGetCategory = (req, res, db) => {
  const { id } = req.params;

  db("category")
    .where("id", "=", id)
    .returning("*")
    .then((category) => {
      res.json({
        "code": 200,
        "data": {
          "category": category[0]
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

const handleGetCategories = (req, res, db) => {
  db("category")
  
    .returning("*")
    .then((categories) => {
      res.json({
        "code": 200,
        "data": {
          "categories": categories
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
  handleGetCategories: handleGetCategories,
  handleGetCategory: handleGetCategory,
  handleCreateCategory: handleCreateCategory,
  handleUpdateCategory: handleUpdateCategory,
  handleDeleteCategory: handleDeleteCategory,
};