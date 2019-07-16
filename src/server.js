require('dotenv-flow').config()

const fastify = require('fastify')
const axios = require('axios')

const { NODE_ENV, PORT, PAGE_ACCESS_TOKEN, VERIFY_TOKEN } = process.env

const loggerLevel = NODE_ENV !== 'production' ? 'debug' : 'info'
const server = fastify({ ignoreTrailingSlash: true, logger: { level: loggerLevel } })

server.get('/', async () => {
  return { iam: '/' }
})

server.post('/webhook', (req, res) => {
  const { body } = req

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0]
      res.log.info(webhookEvent)

      const senderPsid = webhookEvent.sender.id
      if (webhookEvent.message) {
        handleMessage(senderPsid, webhookEvent.message)
      }
    })
    res.code(200).send('EVENT_RECEIVED')
  } else {
    res.code(404)
  }
})

server.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.log.info('Webhook verified')
      res.code(200).send(challenge)
    } else res.code(403)
  }
})

const handleMessage = async (senderPsid, receivedMessage) => {
  const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`
  try {
    if (receivedMessage.text) {
      await axios.post(url, {
        recipient: {
          id: `${senderPsid}`
        },
        message: {
          text: `You sent: "${receivedMessage.text}".`
        }
      })
    }
  } catch (err) {
    server.log.error('Unable to send message: ' + err)
  }
}

const start = async () => {
  try {
    await server.listen(PORT || 3003, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
