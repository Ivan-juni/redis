import Bull from 'bull'
import Queue from 'bull'
import { personRepository } from '../controllers/personController.js'
import personProcess from '../processes/person.process.js'

// first queue for endpont /add-person
const personQueue = new Bull('person-queue', {
  redis: process.env.REDIS_URL,
})

personQueue.process(personProcess)

const addNewPerson = (data) => {
  personQueue.add(data, {
    attempts: 2,
  })
}

// second queue

const people = [
  {
    firstName: 'Chris',
    lastName: 'Stapleton',
    age: 43,
    verified: true,
    location: {
      longitude: -84.495,
      latitude: 38.03,
    },
    locationUpdated: '2022-01-01T12:00:00.000Z',
    skills: ['singing', 'football', 'coal mining'],
    personalStatement:
      "There are days that I can walk around like I'm alright. And I pretend to wear a smile on my face. And I could keep the pain from comin' out of my eyes. But sometimes, sometimes, sometimes I cry.",
  },
  {
    firstName: 'David',
    lastName: 'Paich',
    age: 67,
    verified: false,
    location: {
      longitude: -118.25,
      latitude: 34.05,
    },
    locationUpdated: '2022-01-01T12:00:00.000Z',
    skills: ['singing', 'keyboard', 'blessing'],
    personalStatement:
      "I seek to cure what's deep inside frightened of this thing that I've become",
  },
  {
    firstName: 'Ivan',
    lastName: 'Doroschuk',
    age: 64,
    verified: true,
    location: {
      longitude: -88.273,
      latitude: 40.115,
    },
    locationUpdated: '2022-01-01T12:00:00.000Z',
    skills: ['singing', 'dancing', 'friendship'],
    personalStatement:
      "We can dance if we want to. We can leave your friends behind. 'Cause your friends don't dance and if they don't dance well they're no friends of mine.",
  },
  {
    firstName: 'Joan',
    lastName: 'Jett',
    age: 63,
    verified: false,
    location: {
      longitude: -75.273,
      latitude: 40.003,
    },
    locationUpdated: '2022-01-01T12:00:00.000Z',
    skills: ['singing', 'guitar', 'black eyeliner'],
    personalStatement:
      "I love rock n' roll so put another dime in the jukebox, baby.",
  },
  {
    firstName: 'Justin',
    lastName: 'Timberlake',
    age: 41,
    verified: true,
    location: {
      longitude: -89.971,
      latitude: 35.118,
    },
    locationUpdated: '2022-01-01T12:00:00.000Z',
    skills: ['singing', 'dancing', 'half-time shows'],
    personalStatement: 'What goes around comes all the way back around.',
  },
]

const scheduler = new Queue('myQueue', {
  redis: process.env.REDIS_URL,
  //   defaultJobOptions: { repeat: { every: 1000 } },
})

const controller = async () => {
  // add an array of data
  //   const promises = people.map((person) =>
  //     scheduler.add(person, {
  //       delay: 1000, // 1 sec in ms
  //     })
  //   )
  //   await Promise.all(promises)
  await scheduler.add(people[1], {
    removeOnComplete: true, // remove job if complete
    delay: 60000, // 1 min in ms
    attempts: 1, // attempt if job is error retry 3 times
  })
}

scheduler.process(async (job, done) => {
  console.log(job.data)
  const person = await personRepository.fetch('01GGSK3FN67JBNC6ZGFPA6ZTJC')

  person.firstName = job.data.firstName ?? null
  person.lastName = job.data.lastName ?? null
  person.age = job.data.age ?? null
  person.verified = job.data.verified ?? null
  person.location = job.data.location ?? null
  person.locationUpdated = job.data.locationUpdated ?? null
  person.skills = job.data.skills ?? null
  person.personalStatement = job.data.personalStatement ?? null

  await personRepository.save(person)
  done()
})

controller().catch(console.error)

export default addNewPerson
