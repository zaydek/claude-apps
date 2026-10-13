# Recipe: FastAPI or Flask (Python web server)

**Shape:** local server. The app runs on each person's machine; the claude-apps server holds the key. The app reads the
proxy's address and token from its environment and never holds a vendor key.

`ship.run.json`:

```json
{ "mode": "local", "run": ["python", "-m", "uvicorn", "app:app", "--host", "127.0.0.1"] }
```

(For Flask: `{ "mode": "local", "run": ["python", "app.py"] }`.) The launcher gives the app `PORT`, `HOST`, `SHIP_URL`,
`SHIP_TOKEN`, `SHIP_VERSION`, `SHIP_SHA`, `SHIP_DATA` and `SHIP_USER`. Bind to `os.environ["HOST"]` and
`int(os.environ["PORT"])`.

## The rewrite `/ship` makes (keys out)

```diff
-OPENAI_API_KEY = "DEMO-NOT-A-REAL-KEY-…"
-BASE = "https://api.openai.com"
+import os
+BASE = f'{os.environ["SHIP_URL"]}/v1/openai'
 …
-    headers={"authorization": f"Bearer {OPENAI_API_KEY}", "content-type": "application/json"},
+    headers={"authorization": f'Bearer {os.environ["SHIP_TOKEN"]}', "content-type": "application/json"},
```

Remove the key from every `.env` and config file.

## Signals (Python has no bundled client — post events directly)

Batch events to the same proxy. `SHIP_URL` and `SHIP_TOKEN` are in the environment; events go to `${SHIP_URL}/events`
with the install token:

```python
import os, uuid, time, httpx

def report(events):
    httpx.post(f'{os.environ["SHIP_URL"]}/events',
               headers={"authorization": f'Bearer {os.environ["SHIP_TOKEN"]}'},
               json=events, timeout=5)

report([{ "id": str(uuid.uuid4()), "kind": "session_start",
          "user": os.environ.get("SHIP_USER", "anon"),
          "version": os.environ.get("SHIP_VERSION"), "at": int(time.time()*1000) }])
```

Send `session_start` / `session_end`, an `error` event in your exception handler (`name`, `message`, `stack`), an
`action` with `counters` around each main handler, and a `feedback` event (`text`) from your feedback route. The event
shapes are in [../ingest.md](../ingest.md).

## Wiring it

Say "put this online for my friends". claude-apps moves the key out, deploys the proxy, and publishes the launcher.
