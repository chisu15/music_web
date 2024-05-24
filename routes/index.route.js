const express = require('express');
const musicRoute = require('./music.route');
const albumRoute = require('./album.route');

module.exports = (app) => {
  const version = '/api/v1';
  app.use(version + '/music', musicRoute);
  app.use(version + '/album', albumRoute);
};
