const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const jwt = require('jsonwebtoken')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const events = require('./controllers/events');
const category = require('./controllers/category');
const users = require('./controllers/users');
const guests = require('./controllers/guests');
const securityMeasures = require('./controllers/securityMeasures');
const eventsSecurityMeasures = require('./controllers/eventsSecurityMeasures');
const tasks = require('./controllers/tasks');

const { verifyToken } = require('./middlewares/verifyToken');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '123',
    database: 'safe_event_planner_db'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/api/v1', (req, res)=> res.json({ message: 'Welcome to the Api'}))

app.get('/api/v1/posts', verifyToken, (req, res) => {
      res.json({
        message:'Post Created...',
        session: req.session
      })
})

/*
 Aspectos a mejorar
  - falta logica de user para eliminar todos sus eventos relacionados y sus dependencias
  - Como determinar el nivel de seguridad de un evento
*/

// auth
app.post('/api/v1/signin', signin.handleSignin(db, bcrypt, jwt))
app.post('/api/v1/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// events
app.get('/api/v1/events', verifyToken,  (req, res) => { events.handleGetEvents(req, res, db) }) // get all filter by user logged
app.get('/api/v1/events/:id', verifyToken,  (req, res) => { events.handleGetEvent(req, res, db) }) // get by id
app.post('/api/v1/events', verifyToken,  (req, res) => { events.handleCreateEvent(req, res, db) }) // create
app.put('/api/v1/events/:id', verifyToken,  (req, res) => { events.handleUpdateEvent(req, res, db) }) // update
app.delete('/api/v1/events/:id', verifyToken,  (req, res) => { events.handleDeleteEvent(req, res, db) }) // delete

// guests
app.get('/api/v1/events/:eventId/guests', verifyToken,  (req, res) => { guests.handleGetGuests(req, res, db) }) // get all filter by event Id
app.get('/api/v1/events/:eventId/guests/:id', verifyToken,  (req, res) => { guests.handleGetGuest(req, res, db) }) // get by id
app.post('/api/v1/events/:eventId/guests', verifyToken,  (req, res) => { guests.handleCreateGuest(req, res, db) }) // create
app.put('/api/v1/events/:eventId/guests/:id', verifyToken,  (req, res) => { guests.handleUpdateGuest(req, res, db) }) // update
app.delete('/api/v1/events/:eventId/guests/:id', verifyToken,  (req, res) => { guests.handleDeleteGuest(req, res, db) }) // delete

// tasks
app.get('/api/v1/events/:eventId/tasks', verifyToken,  (req, res) => { tasks.handleGetTasks(req, res, db) } ) // Get all filter by tasks
app.get('/api/v1/events/:eventId/tasks/:id', verifyToken,  (req, res) => { tasks.handleGetTask(req, res, db) }) // Get by id
app.post('/api/v1/events/:eventId/tasks', verifyToken, (req, res) => { tasks.handleCreateTask(req, res, db) }) // Create
app.put('/api/v1/events/:eventId/tasks/:id', verifyToken, (req, res) => { tasks.handleUpdateTask(req, res, db) }) // Update
app.delete('/api/v1/events/:eventId/tasks/:id', verifyToken, (req, res) => { tasks.handleDeleteTask(req, res, db) }) // Delete

// securityMeasures
app.get('/api/v1/securitymeasures', verifyToken,  (req, res) => { securityMeasures.handleGetSecurityMeasures(req, res, db) }) // get all
app.get('/api/v1/securitymeasures/:id', verifyToken,  (req, res) => { securityMeasures.handleGetSecurityMeasure(req, res, db) }) // get by id
app.post('/api/v1/securitymeasures', verifyToken,  (req, res) => { securityMeasures.handleCreateSecurityMeasure(req, res, db) }) // create
app.put('/api/v1/securitymeasures/:id', verifyToken,  (req, res) => { securityMeasures.handleUpdateSecurityMeasure(req, res, db) }) // update
app.delete('/api/v1/securitymeasures/:id', verifyToken,  (req, res) => { securityMeasures.handleDeleteSecurityMeasure(req, res, db) }) // delete

// event securityMeasures
app.get('/api/v1/events/:eventId/securitymeasures', verifyToken,  (req, res) => { eventsSecurityMeasures.handleGetEventSecurityMeasures(req, res, db) }) // get all
app.get('/api/v1/events/:eventId/securitymeasures/:id', verifyToken,  (req, res) => { eventsSecurityMeasures.handleToggleEventSecurityMeasures(req, res, db) }) // get by id
app.post('/api/v1/events/:eventId/securitymeasures', verifyToken,  (req, res) => { eventsSecurityMeasures.handleSetEventSecurityMeasures(req, res, db) }) // create

// category
app.get('/api/v1/categories', verifyToken,  (req, res) => { category.handleGetCategories(req, res, db) }) // get all
app.get('/api/v1/categories/:id', verifyToken,  (req, res) => { category.handleGetCategory(req, res, db) }) // get by id
app.post('/api/v1/categories', verifyToken,  (req, res) => { category.handleCreateCategory(req, res, db) }) // create
app.put('/api/v1/categories/:id', verifyToken,  (req, res) => { category.handleUpdateCategory(req, res, db) }) // update
app.delete('/api/v1/categories/:id', verifyToken,  (req, res) => { category.handleDeleteCategory(req, res, db) }) // delete

// users
app.get('/api/v1/users', verifyToken,  (req, res) => { users.handleGetUsers(req, res, db) }) // get all
app.get('/api/v1/users/by-token', verifyToken,  (req, res) => { users.handleGetUserBySessionToken(req, res, db) }) // get user by token
app.get('/api/v1/users/:id', verifyToken,  (req, res) => { users.handleGetUser(req, res, db) }) // get by id
app.put('/api/v1/users/:id', verifyToken,  (req, res) => { users.handleUpdateUser(req, res, db) }) // update
app.delete('/api/v1/users/:id', verifyToken,  (req, res) => { users.handleDeleteUser(req, res, db) }) // delete
app.get('/api/v1/users/:id/clean', verifyToken,  (req, res) => { users.handleCleanUser(req, res, db) }) // clean


app.listen(process.env.PORT || 3000, ()=> {
  console.log('app is running on port 3000');
})

