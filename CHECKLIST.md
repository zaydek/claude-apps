# Checklist: verify claude-apps on your app

For an agent setting claude-apps up for someone's app. Each item is a job, the exact result you should see, and how to
check it yourself — from a `/ship` command's output, a URL, or the dashboard. It is about **your app**, not any internal
test suite. Nothing here needs a hostname, an internal path, or a key. Tick an item only when you have seen its result.

> Until the `/ship` plugin is published here, the install and verb checks below are what you confirm once it lands; the
> wiring checks you can do today using [docs/recipes](docs/recipes) and [docs/ingest.md](docs/ingest.md).

## 1. Install

- [ ] **The plugin is installed.** After the two install lines, `/ship doctor` runs. Check: every line starts with `ok`;
  no line starts with `fix:`. A `fix:` line tells the person exactly what to do (a login, a card) — do that, then
  re-run.
- [ ] **Auto-update is on.** In `/plugin` → Marketplaces → claude-apps, auto-update shows on. Check: the person confirms
  the toggle, or `/ship doctor` reports it.

## 2. Wire the app (keys out, signals, feedback)

- [ ] **No key in the client or the build.** Check: search the app's source, `.env*` files and the build output for the
  vendor key — there is none. The app calls the server's `/v1/<vendor>` path, with the per-install token (or, for a
  hosted web app, the session cookie), never the key. (See the stack's recipe in [docs/recipes](docs/recipes).)
- [ ] **A signal arrives.** Run the app once yourself. Check: the dashboard's Users view shows one person (you) with a
  session, within a minute, and the version strip names the build.
- [ ] **Feedback arrives, with a picture.** Send one feedback from inside the app, with a screenshot attached. Check: it
  shows on the dashboard's front page and inbox, newest first, quoted, with the image — and it is marked as yours.
- [ ] **An error is captured.** Trigger one handled error (or a `--feedback`-style path). Check: it lands in the inbox,
  grouped by stack and version, with a count.

## 3. QA

- [ ] **Blind testers ran and findings landed.** Run `/ship qa`. Check: the dashboard shows the testers' feedback beside
  humans', marked as agents, tagged with lens (ui/ux/qa) and the user and story they walked; the cost was stated up
  front. `/ship qa ux` runs one lens.
- [ ] **A full pass gates a release.** Say "release it, but qa it first". Check: every described user is walked through
  every story on the build about to go live; all green lets the deploy proceed, anything red stops and asks.

## 4. Deploy

- [ ] **The version is live and says what's new.** Run `/ship deploy`. Check: the dashboard shows the new version as
  live on the release channel, and its one-line "what's new" (which you approved) is shown; people shared with get it on
  their own.
- [ ] **The author approved the note in one step.** Check: `/ship deploy` drafted the changelog line from the changes
  and the test feedback, and asked for one approval, not a form.

## 5. Rollback

- [ ] **One command goes back.** Run `/ship rollback`. Check: the release channel points at the previous build again,
  with no rebuild, and the dashboard shows the live version reverted; a friend who opens the app now gets the old
  version.

## 6. Share

> **GitHub sign-in on the hosted service is landing — not live yet.** The two sign-in checks below are the design; run
> them once sign-in is enabled. Until then, confirm `/ship share` prints the two lines, and use a one-time browser link
> (for a hosted web app) to let a recipient in.

- [ ] **The two lines reach a friend.** Run `/ship share <github-user>`. Check: it prints exactly two lines to send;
  nothing in them is a key.
- [ ] **The recipient opens it, signing in with GitHub.** (Once GitHub sign-in is live.) The friend pastes the two
  lines (for a Claude Code app) or opens the link (for a web app) and signs in with GitHub once — a short code in the
  browser, no SSH key needed. Check: the dashboard's Users view shows them as a new user after they use it.
- [ ] **A no-key friend still gets in.** For someone with no SSH key on GitHub, a one-time browser link (for a web app)
  lets them in today, and the GitHub sign-in will once it's live. Check: they appear as a user with usage.

## 7. Dashboard

- [ ] **It set itself up.** Open the dashboard (`/ship dash`, or the hosted link). Check: with no configuration, the
  first screen answers who used it, what broke and what they said, in about 15 seconds.
- [ ] **Users, stories and panels appear.** Check: the Users view names each person and agent tester with last seen and
  what they said; the Stories view shows each story's latest pass or fail with its evidence; a custom event the app
  reports gets its own panel.

## Done

The app is wired when sections 1-2 pass; it is shareable when 3-6 pass; it is observable when 7 passes. If any item's
result is missing, that is the next thing to fix — fix it, re-run that item, and move on.
