const User = require('../models/user.model');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
const path = require('path');

const {
  OAuth2Client
} = require('google-auth-library');
const redirectUrl = 'http://localhost:3000/profile' 
// const redirectUrl = 'https://musicwebbyahm.vercel.app/profile' 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

module.exports.index = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      code: 200,
      message: "Get all user success!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Get data fail!",
      error: error.message,
    });
  }
};

module.exports.detail = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Not found user",
      });
    }
    res.status(200).json({
      code: 200,
      message: "Get data user success!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Get data fail!",
      error: error.message,
    });
  }
};

module.exports.loginGoogle = (req, res) => {
  try {
    console.log("Client Id: ", process.env.GOOGLE_CLIENT_ID);
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });
    console.log('Generated Auth URL:', url);
    res.redirect(url);
  } catch (error) {
    console.error('Error in loginGoogle:', error);
    res.status(400).json({
      code: 400,
      message: "Login fail!",
      error: error.message,
    });
  }
};

module.exports.callback = async (req, res) => {
  try {
    const { code } = req.query;
    console.log('Code:', code); // Log the code to ensure it is being received
    if (!code) {
      return res.status(400).json({ error: 'Code is missing from query parameters' });
    }

    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI // Ensure redirect_uri is included here
    });
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const user = await User.findOneAndUpdate(
      { googleId: payload.sub },
      {
        googleId: payload.sub,
        email: payload.email,
        username: payload.name,
        picture: payload.picture,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.cookie('token', tokens.id_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None' // Add this line
    });
    console.log(tokens.id_token);
    res.redirect(redirectUrl); // Redirect to the profile page on your Vercel deployment
  } catch (error) {
    console.error('Error in callback:', error);
    res.status(400).json({
      code: 400,
      message: "Callback fail!",
      error: error.message,
    });
  }
};

module.exports.profile = async (req, res) => {
  console.log('Profile endpoint hit');
  try {
    const token = req.cookies.token;
    console.log('Received Token:', token); // Log the token
    if (!token) {
      console.error('No token found in request cookies');
      return res.status(401).send('Unauthorized');
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('Verified Payload:', payload); // Log the payload

    // Fetch user from database using Google ID
    const user = await User.findOne({
      googleId: payload.sub
    });
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Get user profile success!",
      data: user,
    });
  } catch (error) {
    console.error('Error in profile:', error); // Log the error
    res.status(400).json({
      code: 400,
      message: "Get user profile fail!",
      error: error.message,
    });
  }
};

module.exports.update = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const checkuser = await User.findById(id);
    if (!checkuser) {
      return res.status(400).json({
        code: 400,
        message: "Not found user",
      });
    }
    const user = await User.findByIdAndUpdate(
      id, {
        ...req.body,
      }, {
        new: true,
      }
    );
    res.status(200).json({
      code: 200,
      message: "Update success!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: "Update fail",
      error: error.message,
    });
  }
};