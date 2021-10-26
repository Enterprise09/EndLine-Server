const admin = require("firebase-admin");
const express = require("express");
const app = express();
const port = process.env.port || 3000;
const schedule = require("node-schedule");

let account = require("./fcm-server-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(account),
});
const firestore = admin.firestore();
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

app.listen(port, () => {
  console.log("Listen in port ", port);
});

app.get("/", (req, res) => {
  console.log("/: in root url");
  res.send("<h1>in root url</h1>");
});

app.get("/getdata", (req, res) => {
  firestore.collection("test").onSnapshot((snapshot) => {
    const testArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(testArray);
  });
  res.send("<h1>on /getdata</h1>");
});

app.get("/fcm-send", (req, res) => {
  //fcm-send test url
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
  console.log("post : in /register");
  var inputData;
  req.on("data", (data) => {
    inputData = JSON.parse(data);
    firestore.collection("userinfo").add({
      user_uid: inputData.user_uid,
      user_token: inputData.user_token,
    });
  });
  req.on("end", () => {
    console.log(
      "user_uid : " + inputData.user_uid + ", token: " + inputData.user_token
    );
    message.token = inputData.user_token;
  });
  res.write("OK");
  res.end();
});

const timeEvent = schedule.scheduleJob("* * 13 * * *", () => {
  /*
    * execute at 13 hour 
      searching item that have 3days spare
      and sending fcm message
      with some information that item
  */
  firestore.collection("mainData").onSnapshot((snapshot) => {
    const testArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    console.log(testArray);
  });
});
