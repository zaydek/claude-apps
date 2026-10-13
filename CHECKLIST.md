# Checklist: verify Clawed Apps on your app

For an agent setting Clawed Apps up for someone's app. Each item is a job, the exact result you should see, and how to
check it yourself — from a `/clawed` command's output, a URL, or the dashboard. It is about **your app**, not any internal
test suite. Nothing here needs a hostname, an internal path, or a key. Tick an item only when you have seen its result.

## 1. Install

- [ ] **The plugin is installed.** After the two install lines, `/clawed doctor` runs. Check: every line starts with `ok`;
  no line starts with `fix:`. A `fix:` line tells the person exactly what to do (a login, a card) — do that, then
  re-run.
- [ ] **Auto-update is on.** In `/plugin` → Marketplaces → clawed-apps, auto-update shows on. Check: the person confirms
  the toggle.

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

- [ ] **Blind testers ran and findings landed.** Run `/clawed qa`. Check: the dashboard shows the testers' feedback beside
  humans', marked as agents, tagged with lens (ui/ux/qa) and the user and story they walked; the cost was stated up
  front. `/clawed qa ux` runs one lens.
- [ ] **A full pass gates a release.** Say "release it, but qa it first". Check: every described user is walked through
  every story on the build about to go live; all green lets the deploy proceed, anything red stops and asks.

## 4. Deploy

- [ ] **The version is live and says what's new.** Run `/clawed deploy`. Check: the dashboard shows the new version as
  live on the release channel, and its one-line "what's new" (which you approved) is shown; people shared with get it on
  their own.
- [ ] **The author approved the note in one step.** Check: `/clawed deploy` drafted the changelog line from the changes
  and the test feedback, and asked for one approval, not a form.

## 5. Rollback

- [ ] **One command goes back.** Run `/clawed rollback`. Check: the release channel points at the previous build again,
  with no rebuild, and the dashboard shows the live version reverted; a friend who opens the app now gets the old
  version.

## 6. Share

- [ ] **The two lines reach a friend.** Run `/clawed share <name>`. Check: it prints exactly two lines to send; nothing in
  them is a key.
- [ ] **The friend opens it.** The friend pastes the two lines into a terminal and runs `/<app>:open` in Claude Code.
  The link in the lines signs them in; it needs no SSH key and no GitHub account. Check: the dashboard's Users view
  shows them as a new user after they use it.
- [ ] **A GitHub login works too.** `/clawed share <their-github-login> --github` also lets that person in by signing in
  with GitHub (a short code in the browser). Check: they appear as a user with usage.

## 7. Dashboard

- [ ] **It set itself up.** Open the dashboard (`/clawed` with no verb prints its link). Check: with no configuration, the
  first screen answers who used it, what broke and what they said, in about 15 seconds.
- [ ] **Users, stories and panels appear.** Check: the Users view names each person and agent tester with last seen and
  what they said; the Stories view shows each story's latest pass or fail with its evidence; a custom event the app
  reports gets its own panel.

## Done

The app is wired when sections 1-2 pass; it is shareable when 3-6 pass; it is observable when 7 passes. If any item's
result is missing, that is the next thing to fix — fix it, re-run that item, and move on.
