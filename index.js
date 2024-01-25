const expressConfig = require("./expressConfig");
const hbsConfig = require("./hbsConfig");
const connectDB = require("./connectDB");

const port = 3000;

connectDB();
expressConfig(port);
hbsConfig(port);
