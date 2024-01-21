const router = require("express").Router();

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

router.use((req, res, next) => {
  res.status(404).render("404"); 
});

module.exports = router;
