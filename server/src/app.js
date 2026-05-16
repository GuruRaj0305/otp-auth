const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*", // given for all origins, secutiry perspective should only allow specified origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));


module.exports = app;