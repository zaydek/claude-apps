# Recipe: Next.js

Next.js fits two shapes. Pick by whether your app has server code.

## A. Static export (no API routes, no server components calling vendors)

**Shape:** hosted web app. `next build` with `output: 'export'` produces an `out/` folder of static files.

`clawed.run.json`:

```json
{ "mode": "hosted", "web": "out" }
```

Client calls go to the same-origin proxy with no key or token, exactly as in the
[React recipe](react.md): `const BASE = '/v1/openai'` and load `ship` from `/_ca/signals.mjs`.

## B. With a server (API routes, server actions, or an app that calls vendors on the server)

**Shape:** local server (runs on each person's machine) or your own host. The server reads the proxy's address and token
from its environment and never holds a vendor key.

`clawed.run.json`:

```json
{ "mode": "local", "run": ["npm", "run", "start"], "port": 3000 }
```

In your route handlers and server actions:

```diff
-const key = process.env.OPENAI_API_KEY
-const res = await fetch('https://api.openai.com/v1/chat/completions', {
-  headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
+const res = await fetch(`${process.env.CLAWED_URL}/v1/openai/v1/chat/completions`, {
+  headers: { authorization: `Bearer ${process.env.CLAWED_TOKEN}`, 'content-type': 'application/json' },
```

The launcher passes `CLAWED_URL`, `CLAWED_TOKEN`, `CLAWED_VERSION`, `CLAWED_SHA`, `CLAWED_DATA` and `CLAWED_USER` in the app's
environment. Remove the vendor key from every `.env*`.

## Signals

Server side (Node), import the signals client and wrap your handlers; client side, load it from `/_ca/signals.mjs` as in
the React recipe. Add the five points: start, end, error, action and feedback.

## Wiring it

Say "put this online for my friends". Clawed Apps picks A or B from your Next config, moves the key out, and deploys.
