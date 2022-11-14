const redis = require('redis')
const client = redis.createClient()

async function start(channel) {
  const subscriber = client.duplicate()
  await subscriber.connect()

  try {
    console.log(
      `Subscribed to ${channel} channel. Listening for updates on the ${channel} channel...`
    )
  } catch (error) {
    throw new Error(error)
  }

  await subscriber.subscribe(channel, (message) => {
    console.log('Recieved message from publisher: ', message) // 'message'
  })
}

start('status')
