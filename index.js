const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

require('dotenv').config();
const app = express();
const port = process.env.PORT;
const db = require('./config/db');

db.connect();
//  DEV
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://musicwebbyahm.vercel.app'],
//   credentials: true
// }));
app.use(cors());
// Cookie và Body Parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Max-Age', '1800');
  // res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  next();
});

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
        // url: "http://localhost:8080/"
        url: "https://music-web-orcin.vercel.app/",
        description: "My API Documentation"
      }
    ]
  },
  apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(swaggerJsDocOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL })
)

app.listen(port, () => {
  console.log(`Server started on port`, port);
});
