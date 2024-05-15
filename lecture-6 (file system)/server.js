const http = require("http");
const fs = require("fs");
const formidable = require("formidable");

const server = http.createServer();
const PORT = 8000;

// server.on("request", (req, res) => {
//   const data = "This is fs class for may module";
//   console.log(req.method, " ", req.url);

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("Home api is working");
//   }
//   //write
//   else if (req.method === "GET" && req.url === "/writefile") {
//     fs.writeFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Write success");
//     });
//   }
//   //append
//   else if (req.method === "GET" && req.url === "/appendfile") {
//     fs.appendFile("demo.txt", data, (err) => {
//       if (err) throw err;
//       return res.end("Append success");
//     });
//   }
//   //read
//   else if (req.method === "GET" && req.url === "/readfile") {
//     fs.readFile("test.html", (err, data) => {
//       if (err) throw err;
//       console.log(data);
//       return res.end(data);
//     });
//   }
//   //delete
//   else if (req.method === "GET" && req.url === "/deletefile") {
//     fs.unlink("demo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Delete success");
//     });
//   }
//   //rename
//   else if (req.method === "GET" && req.url === "/renamefile") {
//     fs.rename("demo.txt", "newDemo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Rename success");
//     });
//   } else if (req.method === "GET" && req.url === "/streamfile") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       res.end(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   } else {
//     return res.end(`API not found ${req.url}`);
//   }
// });

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/file-upload") {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) throw err;

      const oldPath = files.fileToUpload[0].filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload[0].originalFilename;

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("file uploaded successfully");
      });
    });
  } else {
    fs.readFile("test.html", (err, data) => {
      if (err) throw err;
      return res.end(data);
    });
  }
});

server.listen(PORT, () => {
  console.log(`Http server is running on PORT:${PORT}`);
});
