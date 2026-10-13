# Recipe: plain HTML + JavaScript (calls a model from the browser)

**Shape:** hosted web app. The claude-apps server serves your static files at its https URL and holds the key; the
browser's session cookie signs each call, so there is no key and no token in the page. Twin example:
[examples/hello-web](../../examples/hello-web).

`ship.run.json` in your build output:

```json
{ "mode": "hosted", "web": "." }
```

(`web` is the folder in the build to serve — `.` for a flat site, or `dist`/`public` if you have one.)

## The rewrite `/ship` makes

Before: a key and the vendor base URL are baked into the page.

```diff
-const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-…'
-const BASE = 'https://api.openai.com'
+import { ship } from '/_ca/signals.mjs'
+const s = ship({ url: '', app: 'your-app' })
+s.start()
+const BASE = '/v1/openai'   // Same origin: the claude-apps server adds the real key
 …
-  headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
+  headers: { 'content-type': 'application/json' },
```

## Signals (five points)

```js
s.start()                                   // when the page loads
form.onsubmit = s.action('ask', ask)        // wrap each main action
window.onerror = (m, src, l, c, e) => s.error(e || new Error(m))
window.onunhandledrejection = e => s.error(e.reason)
fbForm.onsubmit = () => s.feedback(input.value)   // your "send feedback" control
```

## Wiring it

In your app's folder, say "put this online for my friends" (or `/ship init`). claude-apps finds the key, moves it to the
server, makes this rewrite, deploys, and gives you a link. Then `/ship share <github-user>`; a browser-only friend gets
a one-time link instead.
