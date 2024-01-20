const express = require('express')
const exphbs = require("express-handlebars");
const path = require("path");

function hbsConfig(port) {
    const app = express()
    
    app.engine('handlebars', exphbs.engine({
        extname: ".handlebars",
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, 'views', 'layouts')
    }))
    app.set('view engine', 'handlebars')

    app.set('views', path.join(__dirname, 'views'));

    app.use('/static', express.static(path.join(__dirname, 'static')));

    app.get('/', (req, res) => {
        res.render('home')
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
      });
}

module.exports = hbsConfig;
