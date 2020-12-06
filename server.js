/*CORS-Cross Origin Resource Sharing
 It is used for cross-domain requests.
 It is a mechanism to allow or restrict requested resources on a web server
*/

const cors = require("cors");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const movieRoute = require("./routes/movies");
const genreRoute = require("./routes/genres");
const userRoute = require("./routes/users");

const app = express();

//To prevent CORS errors
app.use(cors());

//Connecting mongoDB
const databaseConfig = require("./config/keys");
console.log(databaseConfig);
mongoose.connect(databaseConfig, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Checking the connection to db
var db = mongoose.connection;
//'once' it signifies that the event will be called only once
db.once("open", () => console.log("Mongo Database is connected now!"));

db.on("error", console.error.bind(console, "connection error:"));

//static - built-in middleware function in Express. 
//It serves static files and is based on serve-static.
app.use(express.static("./uploads"));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true, limit:"10mb"}));//Parses the text as URL encoded data 
app.use(bodyParser.json({ limit: "10mb" }));//Returns middleware that only parses json

//App routes to handle requests
app.use("/api/movies", movieRoute);
app.use("/api/genres", genreRoute); //cache
app.use("/api/users", userRoute);

//Serve our static files
app.use(express.static("frontend/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  //path.resolve()- resolve a sequence of path-segments to an absolute path
});

const port = process.env.PORT || 5000;
console.log(port);
app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;


/*useNewUrlParser- allow users to fall back to 
the old parser if they find a bug in the new parser
*/

//const port = process.env.PORT || 5000 -whatever is in the environment variable PORT, or 5000 if there's nothing there