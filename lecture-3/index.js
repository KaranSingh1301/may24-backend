const express = require("express"); //ES5

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true })); //data from form

app.use(express.json()); //data comes from axios fetch or postman

app.get("/", (req, res) => {
  console.log("Hii");
  return res.send("Server is up and running");
});

app.get("/home", (req, res) => {
  //   return res.send("home route");
  //   return res.status(201).json("Home roudddte working");
  return res.send({
    status: 202,
    message: "Working",
  });
});

//params
// /api/user/karan

app.get("/api/user/:name", (req, res) => {
  console.log(req.params);
  return res.send("Dynamic api is working");
});

app.get("/api/:id/user", (req, res) => {
  console.log(req.params);
  return res.send("Dynsssamic api is working");
});

app.get("/api/:id1/:id2", (req, res) => {
  console.log(req.params);
  return res.send("Dynsssamic api is working");
});

app.get("/get-form", (req, res) => {
  return res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h1>User form</h1>
    <form action='/form_submit' method='POST'>
      <label for="name">Name</label>
      <input type="text" name="name">
      <br/>
      <label for="email">Email</label>
      <input type="text" name="email">
      <br/>
      <label for="password">Password</label>
      <input type="text" name="password">
        <br/>
      <button type="submit">Submit</button>
    </form>
  </body>
  </html>
  `);
});

app.post("/form_submit", (req, res) => {
  console.log(req.body);

  return res.send("Form submitted successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

// axios, fetch, postman ---> sends the data in JSON format

// /add?num1=100&num2=200   // queries

// /sub/num1/num2 //params

// /mul     /POST

// /div     /POST
