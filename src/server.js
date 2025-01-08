require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const startConnection = require("./config/database");

const PORT = process.env.PORT || 5000;

startConnection();

// CORS Handler
const corsHandler = require("./middlewares/corsHandler");
app.use(corsHandler);

// allow Parsing of JSON payloads to routes
app.use(express.json());


// import routes
const allRoutes = require("./routes/index");
app.use("/api/v1", allRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
