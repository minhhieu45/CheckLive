const express = require('express');
const route = express.Router();
const service = require('../services/render');


route.get('/',service.homeRoutes);
route.post('/newuser',service.createNewUser);
route.get('/delete',service.deleteUser);
module.exports = route;