This is a Claude Code plugin to install, not a place to push your app.

# Clawed Apps

> **Claude Code, installing this for someone?** Follow [llms.txt](llms.txt): install with the two lines below, then do
> the whole job in this same session (no restart), starting with `doctor`.

Clawed Apps puts an app you built with Claude Code in front of people in minutes, without anyone ever holding an API
key, and shows you who used it, what broke and what they said on a dashboard that sets itself up. It is a Claude Code
plugin: in your app's folder you say what you want in plain words — "put this online for my friends", "send this to my
testers", "what are people saying?" — and the `/claw` command does the deploy, the versions, the sharing and the
feedback loop. This repo holds the released plugin (in [plugins/clawed](plugins/clawed)) and its docs. The plugin's source is
not here.

Or tell your own Claude Code, in your app's folder: *"Install the Clawed Apps plugin from github.com/zaydek/clawed-apps,
then ship this app: qa it, deploy it and share it with a friend."* It reads [llms.txt](llms.txt), installs the plugin and
does the whole thing. (This repo is the plugin; your app's code never goes here.)

## What you need

- [Claude Code](https://claude.com/claude-code). Check with `claude --version`; update with `claude update`.
- A GitHub account. The first `/claw` asks you to sign in with GitHub once — a short code you enter in your browser.
- Nothing else to start. Hosting is by us and needs no server account (invite-only for now). You only need a
  [Fly.io](https://fly.io) or Docker account if you choose to run your app's server yourself.

You do not need to hold or paste an API key. Clawed Apps moves the keys your app already has onto a server for you.

## Install

Two lines install it:

```sh
claude plugin marketplace add zaydek/clawed-apps
claude plugin install clawed@clawed-apps
```

Then start Claude Code (`claude`) and: run `/plugin`, go to **Marketplaces**, choose **clawed-apps** and turn on
**auto-update**; then run `/claw doctor` — every line should start with `ok`, and a `fix:` line says what to do.

If Claude Code was already open when you installed, restart it so `/claw` appears. (Claude Code installing it for you
can carry on without a restart: [llms.txt](llms.txt) shows how.)

## Your first five minutes

1. **Check your setup.** `/claw doctor`. Fix anything it flags.
2. **Describe your app.** In your app's folder, tell Claude Code who it's for and what they do with it — two users and
   a few stories, in plain words. Clawed Apps keeps these with your project; the testers in step 4 play exactly these
   users, and your dashboard shows each story's latest pass or fail.
3. **Put it online.** Say "put this online for my friends". Clawed Apps recognises your stack, moves your API keys off
   every user's machine onto a server, deploys it, and hands you a link to share. In minutes.
4. **Try it before anyone else.** `/claw qa` runs blind UI, UX and QA testers who use your app the way people would and
   leave feedback on your dashboard, marked as agents, at a cost it tells you up front.
5. **Share it.** `/claw share <name>` prints two lines to send a friend; `/claw deploy` makes a version live and
   drafts a one-line "what's new"; `/claw rollback` goes back. `/claw users` shows who's using it; `/claw feedback`
   tells us what you think of Clawed Apps itself.

## What your friends do

They paste the two lines you send them into a terminal and run `/<your-app>:open` in Claude Code: a web app opens in
their browser, a command-line app answers in the chat. The link in those lines signs them in and is theirs alone. They
never hold a key. They see what changed in plain words (what's
new, paused, limit reached), and send feedback in one step. Usage flows to your dashboard with nothing for them to do.

## Your keys and their data

Your API keys never leave your server. Nobody you share with ever holds one. You see counts, costs, errors and the
feedback people send — not what they type to your app's AI.

## Updating

With auto-update on (see Install), a new version downloads during a session and loads the next time you start Claude
Code. To update right now:

```sh
claude plugin marketplace update clawed-apps && claude plugin update clawed@clawed-apps
```

Then restart Claude Code.

## Troubleshooting

1. Run `/claw doctor`. Each line starts with `ok` or `fix:`, and a `fix:` line says what to do.
2. If `/claw` itself is missing, update Claude Code (`claude update`) and restart it.
3. Still stuck? `/claw feedback` and describe what happened, in your own words: what you did, what you expected, what
   you got. It reaches us with your version and a short log with anything key-shaped removed.

## Docs

- [llms.txt](llms.txt): the entry point for an agent setting up Clawed Apps for a project.
- [docs/commands.md](docs/commands.md): every `/claw` verb and when to use it.
- [docs/recipes](docs/recipes): how to wire each common stack (HTML+JS, React, Next.js, Express, FastAPI/Flask, Python
  CLI, Node CLI), with a copyable example each.
- [docs/ingest.md](docs/ingest.md): the contract for an app that runs on its own server and only reports usage and
  feedback.
- [docs/hosting.md](docs/hosting.md), [docs/security.md](docs/security.md), [docs/limits.md](docs/limits.md): where it
  runs, how keys stay safe, and the caps that keep your bill from running away.
- [examples](examples): three tiny apps (a CLI, a hosted web app, a local server), one per shape.

## License

This repo, the clawed plugin in [plugins/clawed](plugins/clawed) included, is [MIT licensed](LICENSE).
