# hello-server (local server app)

A small Node web server that calls a model with a fake key baked into `server.mjs`. After `/clawed init`, the key lives on
the Clawed Apps server and **the app's own server runs on each person's machine** at
`http://hello-server.localhost:<port>`. `clawed.run.json` says so: `{"mode": "local", "run": ["node", "server.mjs"]}`.

The launcher gives the app `PORT` and `HOST` (listen there), `CLAUDE_APPS_URL` (its own address), and `CLAWED_URL`,
`CLAWED_TOKEN`, `CLAWED_VERSION`, `CLAWED_SHA`, `CLAWED_DATA`, `CLAWED_USER` as for any app. The port is picked from the project
name in 7500-7799 (or `"port"` in `clawed.run.json`). No Caddy, no certificate: browsers send `*.localhost` to this machine.

```diff
-const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.openai.com'
+import { ship } from './ship/client/ship-signals.mjs'
+const s = ship({ url: process.env.CLAWED_URL, token: process.env.CLAWED_TOKEN, version: process.env.CLAWED_VERSION, sha: process.env.CLAWED_SHA, app: 'hello-server', dir: process.env.CLAWED_DATA })
+await s.start()
+const BASE = `${process.env.CLAWED_URL}/v1/openai`
 …
-    headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
+    headers: { authorization: `Bearer ${process.env.CLAWED_TOKEN}`, 'content-type': 'application/json' },
 …
-    try { text = await greet(url.searchParams.get('name') || 'world') } …
+    try { text = await s.action('greet', greet)(url.searchParams.get('name') || 'world') } …
```

For people: `/hello-server:open` starts it (or says where it already runs), `/hello-server:stop` stops it,
`/hello-server:forget` signs out and deletes its data. On the author's machine it serves at
`http://hello-server.localhost:7500`.
