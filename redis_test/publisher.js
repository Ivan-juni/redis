const redis = require('redis')
const publisher = redis.createClient()

const channel = 'status'

async function publish() {
  await publisher.connect()

  console.log(`Started ${channel} channel publisher...`)
  publisher.publish(channel, 'free')
  //     try {
  //       try {
  //         await publisher.get("users").then((data) => {
  //           if (data) {
  //             console.log("Users retrieved from Redis");
  //             res.status(200).send(JSON.parse(data));
  //             publisher.ttl("users").then((reply) => {
  //               console.log("TTL (time-to-live): ", reply);
  //             });
  //           } else {
  //             axios.get(`${USERS_API}`).then(async function (response) {
  //               const users = response.data;
  //               await publisher.setEx("users", 600, JSON.stringify(users));
  //               console.log("Users retrieved from the API");
  //               res.status(200).send(users);
  //             });
  //           }
  //         });
  //       } catch (err) {
  //         console.error(err);
  //         throw err;
  //       }
  //     } catch (err) {
  //       res.status(500).send({ error: err.message });
  //     }
  //   });
}

publish()
