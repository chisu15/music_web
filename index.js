const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

require('dotenv').config();
const app = express();
const port = process.env.PORT;
const db = require('./config/db');

db.connect();

helmet({
  crossOriginResourcePolicy: false,
})

// Cấu hình CORS
const allowedOrigins = ['http://localhost:3000', 'https://musicwebbyahm.vercel.app', 'https://music-web-orcin.vercel.app', 'https://admin-dashboard-sndprg.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
