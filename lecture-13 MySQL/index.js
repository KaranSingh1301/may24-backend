const express = require("express"); //ES5
const mysql = require("mysql");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//db instance
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karan@130101",
  database: "may24testdb",
  multipleStatements: true,
});

db.connect((err) => {
  if (err) console.log(err);

  //dynamically create the db

  // db.query("CREATE DATABASE testDb", function(err, result){
  //   if(err) throw err;
  //   console.log("Mysql db has been connected successfully");
  // })

  console.log("Mysql db has been connected successfully");
});

app.get("/", (req, res) => {
  return res.send("Server is up and running");
});

app.get("/get-user", (req, res) => {
  db.query("SELECT * FROM user", {}, (err, data) => {
    if (err) console.log(err);
    console.log(data);
    return res.status(200).json(data);
  });
});

app.post("/create-user", (req, res) => {
  const { id, name, email, password } = req.body;

  db.query(
    `INSERT INTO user(id, name, email, password) VALUES (?,?,?,?)`,
    [id, name, email, password],
    (err, data) => {
      if (err) throw err;

      return res.status(201).json(data);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
