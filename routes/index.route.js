const express = require('express');
const musicRoute = require('./music.route');
const albumRoute = require('./album.route');
const userRoute = require('./user.route');
module.exports = (app) => {
  const version = '/api/v1';
  app.use(version + '/music', musicRoute);
  app.use(version + '/album', albumRoute);
  app.use(version + "/user", userRoute);
};
