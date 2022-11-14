const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");
const express = require("express");

const app = express();
const USERS_API = "https://jsonplaceholder.typicode.com/users/";

async function start() {
  await client.connect();

  app.get("/cached-users", async (req, res) => {
    try {
      try {
        client.get("users").then((data) => {
          if (data) {
            console.log("Users retrieved from Redis");
            res.status(200).send(JSON.parse(data));
            client.ttl("users").then((reply) => {
              console.log("TTL (time-to-live): ", reply);
            });
          } else {
            axios.get(`${USERS_API}`).then(async function (response) {
              const users = response.data;
              await client.setEx("users", 600, JSON.stringify(users));
              console.log("Users retrieved from the API");
              res.status(200).send(users);
            });
          }
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
}

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

app.get("/users", (req, res) => {
  try {
    axios.get(`${USERS_API}`).then(function (response) {
      const users = response.data;
      console.log("Users retrieved from the API");
      res.status(200).send(users);
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
  start();
});
