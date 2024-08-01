var express = require("express");
var mysql = require("mysql2");
var fileuploader = require("express-fileupload");
var app = express();
var nodemailer = require("nodemailer");

// Start the server
app.listen(2005, function () {
  console.log("Server Started");
});

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(fileuploader());
app.use(express.urlencoded({ extended: true }));

// Database connection configuration
var dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "cgg@65830",
  database: "hack4change",
  dateStrings: true
};

// Create and connect to the database
var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database successfully");
  }
});

// Serve the main HTML file
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
});

// Fetch data based on state and season
app.get('/fetch-data', (req, res) => {
  const State = req.query.state;
  const Type = req.query.season;

  console.log(State);
  console.log(Type);

  if (!State || !Type) {
    return res.status(400).json({ error: 'State and Type are required.' });
  }

  const query = 'SELECT * FROM hack4change.crop_production_csv WHERE State = ? AND Type = ? ORDER BY Yield DESC ';
  dbCon.query(query, [State, Type], (err, results) => {
    if (err) {
      console.error('Database query error:', err);  // Log the error for debugging
      return res.status(500).json({ error: 'Failed to fetch data from the database.' });
    }
    res.json(results);
  });
});
