const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


require('dotenv').config();
const passport = require("passport");
const app = express();
const port = process.env.PORT;
const db = require('./config/db');

db.connect();
app.use(cors());
app.use(passport.initialize());

app.use(bodyParser.json());

// ROUTE
const route = require('./routes/index.route');
route(app);

const swaggerJsDocOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Music",
      version: "1.0.0",
      description: "API for music",
      contact: {
        name: "Đỗ Trung Hiếu",
        url: "https://www.facebook.com/heu.dtrung.5",
        email: "trunghieudo1509@gmail.com",
      }
    },
    servers: [
      {
        // url: "http://localhost:8080"
        url: "https://music-web-orcin.vercel.app"
      }
    ]
  },
  apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(swaggerJsDocOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
)

app.listen(port, () => {
  console.log(`Server started on port`, port);
});
