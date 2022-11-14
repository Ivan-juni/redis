const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || "127.0.0.1";
const host = process.env.HOST || "6379";

const client = redis.createClient(port, host);

client
  .connect()
  .then(async (res) => {
    console.log("Connected!");

    // Strings
    const sstatus = await client.set("framework", "ReactJS");
    console.log("String status: ", sstatus);

    const sreply = await client.get("framework");
    console.log("String reply: ", sreply);

    // Hashes
    const hstatus = await client.hSet("person_hash", {
      name: "ivan",
      surname: "ivaniuk",
      age: 18,
    });
    console.log("Hash status: ", hstatus);

    const hreply = await client.hGetAll("person_hash");
    console.log("Hash reply: ", hreply);

    // Lists
    // await client.lRem("person_list", -1, "ivan");
    // await client.lRem("person_list", -1, "masha");
    const lstatus = await client.rPush("person_list", ["ivan", "masha"]);
    console.log("List reply: ", lstatus);

    const lreply = await client.lRange("person_list", 0, -1);
    console.log("List reply: ", lreply);

    // Sets
    const setstatus = await client.sAdd("person_set", [
      "ivan",
      "masha",
      "ivan",
    ]);
    console.log("Set reply: ", setstatus);

    const setreply = await client.sMembers("person_set");
    console.log("Set reply: ", setreply);

    // Some operations
    const exists = await client.exists("framework");
    if (exists === 1) {
      const value = await client.get("framework");
      console.log("Exists! Value:", value);
    } else {
      console.log("Doesn't exist!");
    }

    console.log("Del Status: ", await client.del("person_list"));

    await client.set("working_days", 5);

    await client.incr("working_days").then((reply) => {
      console.log("Incr reply: ", reply);
    });

    await client.flushDb().then((reply) => {
      console.log("FlushDb reply: ", reply);
    });

    client.quit();
  })
  .catch((err) => {
    console.log("err happened" + err);
  });
