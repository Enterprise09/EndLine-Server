const admin = require("firebase-admin");

let account = require("./fcm-server-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(account),
});

const express = require("express");
const app = express();

const PORT = 3000;
let token;
let message = {
  notification: {
    title: "제목",
    body: "내용입니다.",
  },
  data: {
    title: "제목",
    body: "내용입니다.",
  },
  token: token,
};

app.listen(PORT, () => {
  console.log("Listen in port 3000");
});

app.get("/", (req, res) => {
  console.log("/: in root url");
  res.send("<h1>in root url</h1>");
});

app.get("/fcm-send", (req, res) => {
  console.log("/fcm-send: in fcm send url");
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Success: ", response);
      res.send("<h1>Success: " + response + "</h1>");
    })
    .catch((err) => {
      console.log("error: ", err);
      res.send("<h1>Error: " + err + "</h1>");
    });
});

app.post("/register", (req, res) => {
  console.log("in /register");
  var inputData;
  req.on("data", (data) => {
    inputData = JSON.parse(data);
  });
  req.on("end", () => {
    console.log(
      "user_uid : " + inputData.user_id + ", token: " + inputData.user_token
    );
    message.token = inputData.user_token;
  });
  res.write("OK");
  res.end();
});
