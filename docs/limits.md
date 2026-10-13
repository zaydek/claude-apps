# Limits

What stops one person, or a bug, from running up your bill.

- **Per person:** requests a minute and a day, dollars a day, four calls at once, and a daily quota of events.
- **Per app:** a daily dollar cap for everyone together, until 00:00 UTC. `/claw pause --cap 5` sets it to $5.
- **Per call:** a call's worst-case cost is reserved before it goes out, and a reply with no usage numbers is charged at
  that worst case.
- **Pause:** `/claw pause` stops every call at once (people see "paused by the author"); `/claw pause --off` starts
  again.

Vendor error messages are replaced or scrubbed, so "incorrect API key" never reaches anyone, and anything shaped like a
key is scrubbed from events on arrival. Raw call rows are kept 30 days, events 90, and feedback files 30 days after
their feedback is done or won't-fix. Set a spend limit in each vendor's console too.
