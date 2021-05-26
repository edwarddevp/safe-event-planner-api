const handleCreateTask = (req, res, db) => {
    const { eventId } = req.params;
    const { body } = req;
    const { title, description } = body;

    if(!title){
          return res.status(400).json({
         "success": false,
         "code": 400,
         "data": {},
         "message": "FormError",
         "erros": {
              "error": [
                  "incorrect form submission"
              ]
         }
    });
    }

    db.transaction((trx) => {
        trx
          .insert({ 
              title, 
            description, 
            isCompleted: false, 
            createdat: new Date(),
            eventid: eventId,
        })
          .into("tasks")
          .returning("*")
          .then((task) => {
            res.json({
              "code": 200,
              "data": {
                "task": task[0]
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

const handleUpdateTask = (req, res, db) => {
    const { eventId } = req.params;
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;

    db("tasks")
    .where({ id: id, eventid: eventId })
    .update({
        title,
        description,
        isCompleted,
    })
     .returning("*")
     .then((task) =>{
         res.json({
             "code": 200,
             "data": {
                "task": task[0]   
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

const handleDeleteTask = (req, res, db) => {
    const { eventId } = req.params;
    const { id } = req.params;
  db("tasks")
   .where({ id: id, eventid: eventId })
   .del()
   .returning("id")
   .then((tasksId) => {
     res.json({
        "code": 200,
        "data": {
           "tasksId": tasksId[0] 
        },
         "message": "Ok",
         "success": true
     });
     })
       .catch((err) => res.status(500).json({
           "succes": false,
           "code": 500,
           "data":{},
           "message": "Internal Server Error",
           "errors": {
               "error": [
                   err
               ]
           }
       }));
};


const handleGetTask = (req, res , db) => {
    const { eventId } = req.params;
    const { id } = req.params;

    db("tasks")
    .where({ id: id, eventid: eventId })
    .returning("*")
    .then((task) => {
        res.json({
            "code": 200,
            "data": {
                "task": task[0]
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
                "error":[
                    err
                ]
            }
        }));
};

const handleGetTasks = (req, res, db) => {
    const { eventId } = req.params;
    
    db("tasks")
      .where({ eventid: eventId })
      .returning("*")
      .then((tasks) => {
        res.json({
            "code": 200,
            "data": {
                "tasks": tasks
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
    handleGetTasks: handleGetTasks,
    handleGetTask: handleGetTask,
    handleCreateTask: handleCreateTask,
    handleUpdateTask: handleUpdateTask,
    handleDeleteTask: handleDeleteTask,
};