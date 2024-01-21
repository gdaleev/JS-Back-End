const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require("./api/routes");
const fs = require('fs')

function hbsConfig(port) {
  const app = express();

  const configFolderPath = path.join(__dirname, 'config');
  const moviesData = JSON.parse(fs.readFileSync(path.join(configFolderPath, 'database.json'), 'utf-8'));

  app.engine(
    "handlebars",
    exphbs.engine({
      extname: ".handlebars",
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "views", "layouts"),
    })
  );
  app.set("view engine", "handlebars");

  app.set("views", path.join(__dirname, "views"));

  app.use("/static", express.static(path.join(__dirname, "static")));

  app.get("/", (req, res) => {
    res.render("home", { movies: moviesData});
  });

  app.use("/", routes);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
}

module.exports = hbsConfig;
