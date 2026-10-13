# Recipe: React (Vite, Create React App, or similar)

**Shape:** hosted web app. You build to static files; the Clawed Apps server serves them and holds the key. The browser
calls the same origin, so there is no key and no token in the bundle.

`clawed.run.json` in your build output (Vite's `dist`, CRA's `build`):

```json
{ "mode": "hosted", "web": "dist" }
```

When you set the project up, give Clawed Apps your build command (e.g. `npm run build`) so each new version is built
before it ships.

## The rewrite `/claw` makes

Point every model call at the same-origin proxy and drop the key. The call usually lives in one module:

```diff
-const BASE = 'https://api.openai.com'
-const headers = { authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` }
+const BASE = '/v1/openai'   // Same origin: the server adds the key
+const headers = { 'content-type': 'application/json' }
```

Remove the key from `.env`, `.env.local` and any `VITE_`/`REACT_APP_` variable — a value baked into a client bundle is
treated as burned.

## Signals

Load the client once and wrap your actions:

```js
// src/ship.js
import { ship } from '/_ca/signals.mjs'
export const s = ship({ url: '', app: 'your-app' })
s.start()
```

```jsx
import { s } from './ship'
const onAsk = s.action('ask', ask)                 // wrap the handler
// in an error boundary's componentDidCatch / onError:
s.error(error)
// your feedback form:
const sendFeedback = text => s.feedback(text)
```

## Wiring it

Say "put this online for my friends" in the project folder. Clawed Apps builds, moves the key out, deploys and hands you
a link. `/claw qa` runs blind testers before any friend looks.
