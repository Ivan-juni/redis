import express from 'express'
import swagger from 'swagger-ui-express'
import YAML from 'yamljs'
import dotenv from 'dotenv'
import { router as personRouter } from './routers/person-router.js'
import { router as searchRouter } from './routers/search-router.js'
import addNewPerson from './queues/person.queue.js'

dotenv.config()

/* create an express app and use JSON */
const app = express()

app.use(express.json())
app.use('/person', personRouter)
app.use('/persons', searchRouter)

const port = process.env.PORT || 8000

/* set up swagger in the root */
const swaggerDocument = YAML.load('api.yaml')
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument))

app.post('/add-person', async (req, res) => {
  try {
    await addNewPerson(req.body)
    res.send({ status: 'ok' })
  } catch (error) {
    console.log(error)
    res.send({ status: 'error' })
  }
})

/* start the server */
app.listen(port, () => console.log(`App listening on port ${port}!`))
