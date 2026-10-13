# Recipe: FastAPI or Flask (Python web server)

**Shape:** local server. The app runs on each person's machine; the Clawed Apps server holds the key. The app reads the
proxy's address and token from its environment and never holds a vendor key.

`clawed.run.json`:

```json
{ "mode": "local", "run": ["python", "-m", "uvicorn", "app:app", "--host", "127.0.0.1"] }
```

(For Flask: `{ "mode": "local", "run": ["python", "app.py"] }`.) The launcher gives the app `PORT`, `HOST`, `CLAWED_URL`,
`CLAWED_TOKEN`, `CLAWED_VERSION`, `CLAWED_SHA`, `CLAWED_DATA` and `CLAWED_USER`. Bind to `os.environ["HOST"]` and
`int(os.environ["PORT"])`.

## The rewrite `/clawed` makes (keys out)

```diff
-OPENAI_API_KEY = "DEMO-NOT-A-REAL-KEY-…"
-BASE = "https://api.openai.com"
+import os
+BASE = f'{os.environ["CLAWED_URL"]}/v1/openai'
 …
-    headers={"authorization": f"Bearer {OPENAI_API_KEY}", "content-type": "application/json"},
+    headers={"authorization": f'Bearer {os.environ["CLAWED_TOKEN"]}', "content-type": "application/json"},
```

Remove the key from every `.env` and config file.

## Signals (Python has no bundled client — post events directly)

Batch events to the same proxy. `CLAWED_URL` and `CLAWED_TOKEN` are in the environment; events go to `${CLAWED_URL}/events`
with the install token:

```python
import os, uuid, time, httpx

def report(events):
    httpx.post(f'{os.environ["CLAWED_URL"]}/events',
               headers={"authorization": f'Bearer {os.environ["CLAWED_TOKEN"]}'},
               json=events, timeout=5)

report([{ "id": str(uuid.uuid4()), "kind": "session_start",
          "user": os.environ.get("CLAWED_USER", "anon"),
          "version": os.environ.get("CLAWED_VERSION"), "at": int(time.time()*1000) }])
```

Send `session_start` / `session_end`, an `error` event in your exception handler (`name`, `message`, `stack`), an
`action` with `counters` around each main handler, and a `feedback` event (`text`) from your feedback route. The event
shapes are in [../ingest.md](../ingest.md).

## Wiring it

Say "put this online for my friends". Clawed Apps moves the key out, deploys the proxy, and publishes the launcher.
