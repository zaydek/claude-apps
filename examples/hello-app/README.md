# hello-app (CLI app)

The CLI example `/claw init` is checked against (the other shapes: `hello-web`, hosted; `hello-server`, local server). `app.mjs` calls a model with a fake key baked in. `clawed.run.json` tells the
launcher how to run a build (`foreground: true` prints the output into the chat, which suits a CLI app; an Electron or
server app leaves it off and may add a `url`).

After `/claw init`, the key is gone from the tree and the call goes through the project's Clawed Apps server:

```diff
-const ANTHROPIC_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.anthropic.com'
+import { ship } from './ship/client/ship-signals.mjs'
+const s = ship({ url: process.env.CLAWED_URL, token: process.env.CLAWED_TOKEN, version: process.env.CLAWED_VERSION, sha: process.env.CLAWED_SHA, app: 'hello-app', dir: process.env.SHIP_DATA })
+const BASE = `${process.env.CLAWED_URL}/v1/anthropic`
 …
-    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
+    headers: { authorization: `Bearer ${process.env.CLAWED_TOKEN}`, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
 …
-console.log(await greet(process.argv[2] || 'world'))
+await s.start()
+if (process.argv[2] === '--feedback') { await s.feedback(process.argv.slice(3).join(' ')); console.log('feedback sent') }
+else try { console.log(await s.action('greet', greet)(process.argv[2] || 'world')) } catch (e) { s.log(`greet failed for ${process.argv[2] || 'world'}`); await s.error(e); console.log(`error: ${e.message}`) }
+await s.end()
```

Try it on your machine after `ship.mjs dev --fake` and `ship.mjs me`: `ship.mjs run` greets through the proxy, and
`ship.mjs run -- --feedback "it's slow"` lands in the inbox. Both carry the git version, so errors group by build.
