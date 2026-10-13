# Recipe: Node CLI

**Shape:** CLI. The tool runs on each person's machine; the Clawed Apps server holds the key. Twin example:
[examples/hello-app](../../examples/hello-app).

`clawed.run.json`:

```json
{ "run": ["node", "app.mjs"], "foreground": true }
```

`foreground: true` prints the tool's output into the chat. The launcher passes `CLAWED_URL`, `CLAWED_TOKEN`, `CLAWED_VERSION`,
`CLAWED_SHA`, `CLAWED_DATA` and `CLAWED_USER` in the environment.

## The rewrite `/claw` makes

```diff
-const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.openai.com'
+import { ship } from './ship/client/ship-signals.mjs'
+const s = ship({ url: process.env.CLAWED_URL, token: process.env.CLAWED_TOKEN, version: process.env.CLAWED_VERSION, sha: process.env.CLAWED_SHA, app: 'your-app', dir: process.env.CLAWED_DATA })
+const BASE = `${process.env.CLAWED_URL}/v1/openai`
 …
-  headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
+  headers: { authorization: `Bearer ${process.env.CLAWED_TOKEN}`, 'content-type': 'application/json' },
```

## Signals (five points)

```js
await s.start()                                             // at startup
try { console.log(await s.action('greet', greet)(name)) }  // wrap the main action
catch (e) { s.log(`greet failed for ${name}`); await s.error(e) }
if (process.argv[2] === '--feedback') await s.feedback(process.argv.slice(3).join(' '))
await s.end()                                              // before exit
```

## Wiring it

Say "put this online for my friends". Clawed Apps moves the key out, deploys the proxy, and publishes the launcher so a
friend runs `/<your-app>:open` to use the tool.
