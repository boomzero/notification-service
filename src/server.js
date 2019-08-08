require('dotenv-flow').config()

const fastify = require('fastify')
const axios = require('axios')

const {
  NODE_ENV,
  PORT,
  FB_PAGE_ACCESS_TOKEN,
  FB_VERIFY_TOKEN,
  RECIPIENT_ID
} = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

server.get('/', async () => {
  return { iam: '/' }
})

server.get('/messenger/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
      res.log.info('Webhook verified')
      res.code(200).send(challenge)
    } else res.code(403)
  }
})

server.post('/messenger/webhook', (req, res) => {
  const { body } = req
  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0]
      const senderId = webhookEvent.sender.id
      res.log.info(senderId)
    })
    res.code(200).send('EVENT_RECEIVED')
  } else res.code(404)
})

server.post('/notifications/changes', async (req, res) => {
  const { body } = req
  const facebookUrl = `https://graph.facebook.com/v2.6/me/messages?access_token=${FB_PAGE_ACCESS_TOKEN}`
  try {
    await axios.post(facebookUrl, {
      recipient: {
        id: `${RECIPIENT_ID}`
      },
      message: {
        text: `Website ban dang theo doi: "${body.url}" da co su thay doi`
      }
    })
    for (const cssSelector in body.changes) {
      await axios.post(facebookUrl, {
        recipient: {
          id: `${RECIPIENT_ID}`
        },
        message: {
          text: `Gia tri "${cssSelector}" da thay doi, chuyen tu "${
            body.changes[cssSelector][0]
          }" sang "${body.changes[cssSelector][1]}"`
        }
      })
    }
    res.code(204)
  } catch (err) {
    server.log.error(err.message)
    res.code(500)
  }
})

const start = async () => {
  try {
    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
