const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require("./api/routes");
const fs = require("fs");
const bodyParser = require("body-parser");

function hbsConfig(port) {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const configFolderPath = path.join(__dirname, "config");
  const databasePath = path.join(configFolderPath, "database.json");

  // Read the database file and parse its content once
  const moviesData = JSON.parse(fs.readFileSync(databasePath, "utf-8"));

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

  app.post("/create", (req, res) => {
    const formData = req.body;
    const maxId = moviesData.length > 0 ? Math.max(...moviesData.map(item => item.id)) : 0;
    const newId = maxId + 1;
    const newRecord = { id: newId, ...formData };
    moviesData.push(newRecord);
    fs.writeFileSync(databasePath, JSON.stringify(moviesData, null, 2));
    res.redirect('/');
  });

  app.get("/", (req, res) => {
    res.render("home", { movies: moviesData });
  });

  app.use("/", routes);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
}

module.exports = hbsConfig;
