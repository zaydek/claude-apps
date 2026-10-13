# Recipe: Express (or any Node web server)

**Shape:** local server. The app's own server runs on each person's machine at `http://your-app.localhost:<port>`; the
claude-apps server holds the key. Twin example: [examples/hello-server](../../examples/hello-server).

`ship.run.json`:

```json
{ "mode": "local", "run": ["node", "server.mjs"] }
```

The launcher gives the app `PORT` and `HOST` to listen on, plus `SHIP_URL`, `SHIP_TOKEN`, `SHIP_VERSION`, `SHIP_SHA`,
`SHIP_DATA` and `SHIP_USER`. Listen on `process.env.PORT` / `process.env.HOST`.

## The rewrite `/ship` makes

```diff
-const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.openai.com'
+import { ship } from './ship/client/ship-signals.mjs'
+const s = ship({ url: process.env.SHIP_URL, token: process.env.SHIP_TOKEN, version: process.env.SHIP_VERSION, sha: process.env.SHIP_SHA, app: 'your-app', dir: process.env.SHIP_DATA })
+await s.start()
+const BASE = `${process.env.SHIP_URL}/v1/openai`
 …
-  headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
+  headers: { authorization: `Bearer ${process.env.SHIP_TOKEN}`, 'content-type': 'application/json' },
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

Say "put this online for my friends" in the project folder. claude-apps moves the key out, deploys the proxy, and
publishes a launcher so a friend runs `/<your-app>:open` to start the server on their own machine.
