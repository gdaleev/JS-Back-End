const router = require("express").Router();
const path = require('path')
const fs = require('fs')

router.get("/", (req, res) => {
  res.render("main");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.get("/search", (req, res) => {
  res.render("search");
}); 

router.get("/details/:id", (req, res) => {
  let movieId = req.params.id;
  movieId = movieId.replace(':', '');

  const databasePath = path.join(__dirname, "..", "config", "database.json")
  const moviesData = JSON.parse(fs.readFileSync(databasePath, 'utf-8'))

  const movie  = moviesData.find(movie => movie.id == movieId)

  res.render("details", { movie })
})

router.use((req, res, next) => {
  res.status(404).render("404"); 
});



module.exports = router;
