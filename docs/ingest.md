# Sending signals and feedback from any app

For an app that runs on its own (not started through a friend's `/<app>:open`) and only needs to report how it is being
used. (An app started through `/<app>:open` gets `CLAWED_URL` and `CLAWED_TOKEN`, which post to the same places.) `/claw signals`, in the app's folder, puts the app on Clawed Apps if it isn't yet and writes its two settings to
`~/.config/clawed-apps/<app>.env` (mode 600):

| Setting | What |
| :- | :- |
| `CLAWED_SIGNALS_URL` | `https://<service>/p/<you>/<app>/events` |
| `CLAWED_SIGNALS_KEY` | `shs_...`: it can post events and feedback to this one app and do nothing else. Running `/claw signals` again replaces it |

This contract is stable. If addresses change later, this endpoint keeps answering at the same path (or redirects with
307, so the method and body survive).

## What an app sends

Four things, and nothing else is needed:

1. **Who**: `user`, a stable id for the person (a login, an install id). Letters, digits, `.@+-_`, up to 64 characters.
2. **Which version** they are on: `version`, the dashboard groups everything by it.
3. **Events**: each tool call or named action, `{ "kind": "tool_call", "tool": "<name>", "ms": 140, "ok": true }`.
   Something that broke is the same event with `"ok": false`, and an `"error"` line if there is one.
4. **What they said**: `{ "kind": "feedback", "text": "..." }`, with pictures, audio or video as files (below).

## The call

```
POST $CLAWED_SIGNALS_URL
Authorization: Bearer $CLAWED_SIGNALS_KEY
Content-Type: application/json

[ { "id": "…uuid…", "kind": "tool_call", "user": "alice", "version": "1.4.2", "tool": "search", "ms": 140, "ok": true }, … ]
```

- The body is a JSON array of events, or `{"events": [...]}`. At most 500 events and 6 MB per call. Batch them: send every
  few seconds, or at the end of a session.
- `200 {"ok": n}`: stored. `400`: bad JSON, or an event with no `user`. `401`: a wrong key. `413`: too big. `429`: that
  person passed today's quota (5,000 events, 20 MB). `503`: the app is paused. Retry 5xx later; drop 400 and 413.
- `id` (a UUID) makes a retry safe: an event whose id was already stored is skipped. `at` (milliseconds since 1970)
  defaults to when it arrived.
- Anything that looks like an API key, token or private key is replaced with `[key]` before it is stored.

## Events

| `kind` | Fields | On the dashboard |
| :- | :- | :- |
| `tool_call` | `tool` (the tool or action's name), `ms`, `ok`; `error` when `ok` is false | Events: calls per tool per day, people, failures and the median time; a failure also shows under what broke |
| `tool_calls` | A batch: `counts: { "<tool>": n }`, optional `ms: { "<tool>": mean }` and `failed: { "<tool>": n }` | The same as that many `tool_call`s |
| `feedback` | `text` (up to 4,000 characters); files as uploads (below) | What they said, newest first, quoted, with its files |

An MCP server reports in one line after each tool call (which tool, how long, whether it worked; nothing the person
typed):

```js
fetch(process.env.CLAWED_SIGNALS_URL, { method: 'POST', headers: { authorization: `Bearer ${process.env.CLAWED_SIGNALS_KEY}`, 'content-type': 'application/json' },
  body: JSON.stringify([{ kind: 'tool_call', user, version, tool: name, ms: Date.now() - t0, ok: !failed }]) }).catch(() => {})
```

`GET /ops/usage` (the app's owner) gives per tool the last 7 days' calls, people and failures, the median time, and calls
per day for 14 days. The clawed plugin reports its own verbs this way (verb, time, worked or not; `CLAWED_NO_USAGE=1`
stops it).

## Feedback with files (uploads)

Pictures, audio and video go as files beside the feedback, not inside the JSON. Two ways, with the same key:

```
POST https://<service>/p/<you>/<app>/feedback          multipart/form-data: fields user, text, version, id (a UUID);
Authorization: Bearer $CLAWED_SIGNALS_KEY                 then one part per file, each with its filename and type
-> 200 {"ok": true, "id": "<8 letters>", "files": [{"name", "type", "kind", "bytes"}]}

PUT  https://<service>/p/<you>/<app>/feedback/<id>/files/<name>    the raw bytes, with Content-Type; adds one file
                                                                   to the feedback sent with that id
```

`POST /feedback` also takes plain JSON (`user`, `text`, `version`), for feedback without files.

- **Limits:** 50 MB a file, 10 files a feedback, 200 MB a person a day, 5 GB an app. Over them: `413`, `429` or `507`.
- **Pictures** lose their location and camera data (EXIF) before they are stored. Audio and video are kept as sent.
- **Kept:** 30 days after the feedback is marked done or won't-fix; open feedback keeps its files.

