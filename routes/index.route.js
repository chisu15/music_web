const express = require('express');
const musicRoute = require('./music.route');

module.exports = (app) => {
  const version = '/api/v1';
  app.use(version + '/music', musicRoute);

};
