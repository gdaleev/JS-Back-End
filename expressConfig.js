const express = require("express");
const path = require("path");

function expressConfig(port) {
  const app = express();
  app.use(express.static(path.join(__dirname, "static")));

  app.get("/", function (req, res) {
    res.send("hello world");
  });

  // app.listen(port, () => {
  //   console.log(`Server is listening on port ${port}...`);
  // });
}

module.exports = expressConfig;
