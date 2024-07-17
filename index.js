import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const saltRounds = 10;
const users = [];

app.get("/", (req, res) => {
  return res.render("home.ejs");
});

app.get("/login", (req, res) => {
  return res.render("login.ejs");
});

app.get("/register", (req, res) => {
  return res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error("Error while hashing, ", err);
      return res.send("Error while hashing, ", err);
    } else {
      users.push({ username: req.body.username, password: hash });
      return res.render("secrets.ejs");
    }
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = users.filter((user) => user.username == username);
  if (user.length > 0) {
    bcrypt.compare(password, user[0].password, (err, result) => {
      if (err) {
        console.error("Error while comparing passwords!");
        return res.send("Error while comparing passwords!");
      } else {
        return res.render("secrets.ejs");
      }
    });
  } else {
    console.log("user not found");
    return res.send("user not found");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
