# Limits

What stops one person, or a bug, from running up your bill.

- **Per person:** requests a minute, requests a day, dollars a day, a few calls at once, and a daily event quota.
- **Per project:** a daily dollar cap — once it's hit, every call gets a `503` until midnight UTC.
- **Per request:** a body-size cap. A call's worst-case cost is reserved before it is forwarded, and a reply with no
  usage numbers is charged at that worst case, so nothing slips through uncounted.

`/ship share <user> --cap N --rpm N --rpd N` sets one person's dollar cap and request limits. `/ship` can stop every
call at once (a kill switch) and turn them back on. Set a spend limit in each vendor's console too, as a backstop.

Raw call records are kept 30 days, events 90. Builds nothing points at are pruned. Upstream error bodies are replaced or
scrubbed, and key-shaped strings are removed from events on arrival.
