# hello-web (hosted web app)

A static page that calls a model from the browser with a fake key baked into `web/app.js`. After `/claw init`, the
Clawed Apps server holds the key and **hosts the page itself** at its https URL, to signed-in people only.
`clawed.run.json` says so: `{"mode": "hosted", "web": "web"}` (the folder in the build to serve).

The rewrite `/claw init` makes (same origin, so no URL and no token: the browser's session cookie signs each call):

```diff
-const ANTHROPIC_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.anthropic.com'
+import { ship } from '/_ca/signals.mjs'
+const s = ship({ url: '', app: 'hello-web' })
+s.start()
+const BASE = '/v1/anthropic' // Same origin: the Clawed Apps server adds the key
 …
-    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
+    headers: { 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
 …
-$('greet').onsubmit = … await greet($('name').value) …
+$('greet').onsubmit = … await s.action('greet', greet)($('name').value) …
-$('fb').onsubmit = e => { e.preventDefault(); $('fbout').textContent = 'there is nowhere to send feedback yet' }
+$('fb').onsubmit = e => { e.preventDefault(); s.feedback($('text').value).then(() => { $('fbout').textContent = 'sent, thank you' }) }
```

How people get in: `/hello-web:open` in Claude Code opens a one-time sign-in link (the launcher is already enrolled by
SSH key); its Continue button sets an HttpOnly session cookie for 90 days. Someone with only a browser gets a link from
the author: `ship.mjs link <name>`. `/claw share --remove <name>` ends every session they have.

Paths the server keeps for itself, so the app cannot use them: `/ping`, `/ops`, `/v1`, `/enroll`, `/token`, `/feed`,
`/builds`, `/events`, `/_ca`. Any other path with no file and no extension gets `index.html` (single-page apps work).
