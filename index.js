const express = require("express");
const expressConfig = require("./expressConfig");
const hbsConfig = require("./hbsConfig");

const port = 3000;
expressConfig(port);
hbsConfig(port);
