const admin = require('firebase-admin');

let account = require('./fcm-server-sdk.json');

admin.initializeApp({
    credential: admin.credential.cert(account),
});

const express = require('express');
const app = express();

let token = "eeHQmOe-_zI:APA91bEgGayAbOX7rPPwnS2GLvmsBdB-TeZnQhHAtWjJT4m3qgHQKh08OxUwKzc9Cx-2aiY2zMVHl1v_7oAmkJY4FgPPRSVp0_JBenxRUK6Erv6mKRBXswEwGyfhRVvVaNsT2_VqXKb-";

let message = {
    notification: {
        title: "제목",
        body: "내용입니다."
    },
    data: {
        title: "제목",
        body: "내용입니다."
    },
    token: token,
};

console.log("/send url");
admin.messaging()
.send(message)
.then(function(response){
    console.log('Seccess: ', response);
})
.catch(function(err){
    console.log('error: ', err);
})