# Recipe: Python CLI

**Shape:** CLI. The tool runs on each person's machine; the claude-apps server holds the key. Output prints into the
chat.

`ship.run.json`:

```json
{ "run": ["python", "app.py"], "foreground": true }
```

`foreground: true` prints the tool's output into the chat, which suits a CLI. The launcher passes `SHIP_URL`,
`SHIP_TOKEN`, `SHIP_VERSION`, `SHIP_SHA`, `SHIP_DATA` and `SHIP_USER` in the environment.

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

## Signals (post events directly)

```python
import os, uuid, time, httpx

def report(events):
    httpx.post(f'{os.environ["SHIP_URL"]}/events',
               headers={"authorization": f'Bearer {os.environ["SHIP_TOKEN"]}'},
               json=events, timeout=5)

user = os.environ.get("SHIP_USER", "anon")
ver = os.environ.get("SHIP_VERSION")
report([{ "id": str(uuid.uuid4()), "kind": "session_start", "user": user, "version": ver, "at": int(time.time()*1000) }])
# … do the work, time it, catch errors …
report([{ "id": str(uuid.uuid4()), "kind": "session_end", "user": user, "version": ver, "ms": elapsed_ms }])
```

Add an `error` event on an exception (`name`, `message`, `stack`), an `action` with `counters` around the main command,
and let a `--feedback "<words>"` flag send a `feedback` event (`text`). Event shapes: [../ingest.md](../ingest.md).

## Wiring it

Say "put this online for my friends". claude-apps moves the key out, deploys the proxy, and publishes the launcher so a
friend runs `/<your-app>:open` to use the tool.
