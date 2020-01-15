const {Router} = require('express');
const devController = require('./controllers/devController');
const searchController = require('./controllers/searchController');


const routes = Router();

routes.get('/devs', devController.index);//get all users
routes.post('/devs', devController.store);//create new user
routes.put('/devs/:github_username',devController.update);//update user values
routes.delete('/devs/:github_username',devController.delete);//delete a user

routes.get('/search',searchController.index);//look for another person within a distance



module.exports = routes;