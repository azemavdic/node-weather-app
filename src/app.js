const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require('./utils/geocode')
const forecast = require("./utils/weather");

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Vremenska prognoza",
    name: "Azem Avdić",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "O Nama",
    name: "Azem Avdić",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Pomoć",
    name: "Azem Avdić",
  });
});

app.get("/weather", (req, res) => {
  if(!req.query.address) {
    return res.send({
      error: 'Morate upisati adresu!'
    })
  }else {
    const address = req.query.address
  geocode(address, (error, { latitude, longitude, location} = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({error});
      }

      res.send({
        forecast: forecastData,
        location,
        address
      });
    });
  });
}

});

app.get('/products', (req, res) => {
if (!req.query.search) {
  return res.send({
    error: 'You must provide a search term'
  })
}

  console.log(req.query.search);
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Azem Avdić',
        text: 'Članak za pomoć nije pronađen'
    })
})

app.get('*', (req, res) => {
res.render('404', {
    title: "404",
    name: 'Azem Avdić',
    text: 'Stranica nije pronađena',
})
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
