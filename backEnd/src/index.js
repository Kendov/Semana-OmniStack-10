const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");
const routes = require("./routes");


const app = express();

mongoose.connect(
    config.dbKey,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
);

app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(3333);


