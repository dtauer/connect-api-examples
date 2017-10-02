const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
// const xml2json = require('xml2json')
const xml2json = require("simple-xml2json");
const server = express();

// Grab the account info from our environment varaibles file and add them to process.env
require("dotenv").config({ path: "variables.env" });

// All HTML files will be served out of a /public folder
server.use(express.static(path.join(__dirname, "./public")));

// If the root directory is browsed, list all the files in the public folder
server.get("/", (req, res) => {
  // Grab all the HTML files in the /public folder
  // Build an unordered list with links to the files
  fs.readdir("./public/", (err, files) => {
    const output = files.reduce((prev, curr) => {
      return (prev += `<li><a href="/${curr}">${curr}</a></li>`);
    }, "");
    res.send(`<h2>Files</h2><ul>${output}</ul>`);
  });
});

let cookie = ""; // this will store our BREEZESESSION while developing locally
let retries = 0; // The seesion can expire, so we'll try to log in again if that happens. retries will keep track of how many login attempts happen

// All our API request will be hitting /api/xml so we'll catch those request here and proxy them to the Connect server
server.get("/api/xml", async (req, res) => {
  // If there isn't a session, login to get a session (using the credentials in variables.env)
  if (cookie === "") {
    const login = await axios({
      url: `${process.env.CONNECT_URL}/api/xml?action=login&login=${process.env.CONNECT_USERNAME}&password=${process.env
        .CONNECT_PASSWORD}`
    });
    // Grab the cookie from the login result. We'll pass this with each subsequent request
    cookie = login.headers["set-cookie"][0];
  }

  // Now pass the original request on to the Connect server (like a proxy) and return the result
  const results = await axios({
    url: `${process.env.CONNECT_URL}${req.url}`,
    withCredentials: true,
    headers: {
      cookie
    }
  });

  // Grab the data from the API result and convert it to JSON
  // const data = JSON.parse(xml2json.toJson(results.data))
  const data = xml2json.parser(results.data);
  console.log(data);

  // There's a chance the session/cookie will expire for lack of activity. If we don't get back a status of "ok", our cookie is probably invalid.
  // Clear the cookie and try the whole thing again.
  if (data.results.status.code !== "ok" && retries < 3) {
    retries++; //increment our retry variable. Only want to rety a couple times so we don't end up in an infinite loop
    cookie = "";
    console.log(`Cookie is invalid or you are logged out. Retry #${retries}`);
    res.redirect(req.url);
  } else {
    if (retries === 3) {
      console.log(
        "Node tried 3 times to log in to your Connect account. Check your credentials in varaibles.env. Also try restarting the node server."
      );
    }
    retries = 0; // We can reset retries since we logged in correctly (or failed > 3 times)

    // Finally, we send the original XML result back to our client application.
    res.send(results.data);
  }
});

// Grab the desired development port form the env variables or just use 1999 (e.g. localhost:1999/ )
const port = process.env.PORT || 1999;

// Start the Node development server
server.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
