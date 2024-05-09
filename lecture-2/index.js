const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("home route is working");

  return res.send("Server is running");
});

app.get("/home", (req, res) => {
  console.log(req);

  return res.send("/home is working");
});

//Query
// /api?key=val

app.get("/api", (req, res) => {
  console.log(req.query);
  return res.send("Query recevied");
});

// /api?key1=val1&key2=val2&key3=val3
app.get("/api1", (req, res) => {
  console.log(req.query);
  const key1 = req.query.key1;
  const key2 = req.query.key2;
  const key3 = req.query.key3;
  console.log(key1, key2, key3);
  return res.send("Query recevied");
});

// api2?key=val,val2
app.get("/api2", (req, res) => {
  console.log(req.query);
  console.log(req.query.key.split(","));

  return res.send("Query recevied");
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
