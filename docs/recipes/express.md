# Recipe: Express (or any Node web server)

**Shape:** local server. The app's own server runs on each person's machine at `http://your-app.localhost:<port>`; the
Clawed Apps server holds the key. Twin example: [examples/hello-server](../../examples/hello-server).

`clawed.run.json`:

```json
{ "mode": "local", "run": ["node", "server.mjs"] }
```

The launcher gives the app `PORT` and `HOST` to listen on, plus `CLAWED_URL`, `CLAWED_TOKEN`, `CLAWED_VERSION`, `CLAWED_SHA`,
`CLAWED_DATA` and `CLAWED_USER`. Listen on `process.env.PORT` / `process.env.HOST`.

## The rewrite `/claw` makes

```diff
-const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.openai.com'
+import { ship } from './ship/client/ship-signals.mjs'
+const s = ship({ url: process.env.CLAWED_URL, token: process.env.CLAWED_TOKEN, version: process.env.CLAWED_VERSION, sha: process.env.CLAWED_SHA, app: 'your-app', dir: process.env.CLAWED_DATA })
+await s.start()
+const BASE = `${process.env.CLAWED_URL}/v1/openai`
 …
-  headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
+  headers: { authorization: `Bearer ${process.env.CLAWED_TOKEN}`, 'content-type': 'application/json' },
```

## Signals (five points)

```js
await s.start()                                        // at startup
app.post('/ask', s.action('ask', askHandler))          // wrap each route's work
process.on('uncaughtException', e => s.error(e))
process.on('unhandledRejection', e => s.error(e))
app.post('/feedback', (req, res) => s.feedback(req.body.text).then(() => res.end('ok')))
```

## Wiring it

Say "put this online for my friends" in the project folder. Clawed Apps moves the key out, deploys the proxy, and
publishes a launcher so a friend runs `/<your-app>:open` to start the server on their own machine.
