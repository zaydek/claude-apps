# Commands

Everything `/claw` does. You can type the words, or say what you want and Claude picks them. Each one also exists as a
tool Claude can call directly (the plugin's MCP tools), with the same words and the same answers.

## Install

```sh
claude plugin marketplace add zaydek/clawed-apps
claude plugin install clawed@clawed-apps
```

On Claude Code 2.1.275 or later, one line in Claude Code does both: `/plugin install clawed --marketplace zaydek/clawed-apps`.

## The words

| Say | What it does |
| :- | :- |
| `/claw` | How the app in this folder is going: what is live, who used it this week, what broke, what they said, how the stories did; and your dashboard's address (it opens nothing and prints no sign-in link) |
| `/claw open` | Opens your dashboard in your browser, signed in (where no browser can open, it prints a one-time link) |
| `/claw link` | A one-time link, good for 10 minutes, that signs a browser in to your dashboard: for a phone or another computer |
| `/claw init` | Sets this folder up on Clawed Apps (`qa`, `deploy` and `share` do too). In a new folder it first says what it would do, the app's name and every line holding a key it would move, and changes nothing until you say yes. The words that only read never set anything up, and take `--app <name>` from another folder |
| `/claw qa` | Makes a test version and starts blind testers: one Claude agent per described user and per lens (QA: does it work; UX: does it make sense; UI: does it read right), each walking that user's stories. It says the cost and time first. `/claw qa ux` runs one lens. Each tester runs its own copy on a port of its own; a web app or a server opens in a headless browser (Playwright's own Chromium, installed the first time) that the tester clicks and types in, and its screenshots go into the qa table. A story that happens on a phone is walked on a phone-size screen (390 by 844), which says when the page scrolls sideways |
| `/claw deploy` | Makes the test version live. It shows the qa table and what changed, drafts a one-line "what's new" for you to approve, and your friends see it at their next start. It waits for a qa run on that exact version (the same files: committing them after qa keeps it), of any lens, in which every story walked passed (it then says which lenses ran); a red story or no qa stops it: fix first, or deploy anyway (`--anyway`) |
| `/claw rollback` | Back to the version live before |
| `/claw share sam` | Gives Sam the app: two lines they paste. `--test` gives them the test version; `--github` lets them sign in with a GitHub code (as the GitHub user `sam`) instead of the link; `--tester` marks a test account or test machine, shared like anyone but never counted as a person; `--remove` takes it back |
| `/claw users` | Who used it (people and agent testers), and the described users qa plays. "Add a user: Maya, a nurse on night shifts" adds one |
| `/claw stories` | What people do with the app, and how each story did in qa (works, makes sense, useful). Say a story to add it; `stories export` writes a copy to STORIES.md |
| `/claw said` | What people and testers said that is still open; after a fix, Claude answers them and they see it at their next start |
| `/claw pause` | Stops every call at once; `--off` starts again; `--cap 5` sets the daily dollar cap |
| `/claw remove recipe-box` | Deletes one of your apps from Clawed Apps with everything it holds; Claude asks you first |
| `/claw feedback` | Tells the Clawed Apps team what you think (not your app's people) |
| `/claw doctor` | Checks Node, Claude Code, your sign-in, this folder, keys left in files, and the testers' headless browser (it starts it once); one `ok` or `fix:` line each. `--browser` installs that browser again when it does not start |

Chain them in one breath: "qa it, deploy it and share it with zaydek" runs all three without stopping to ask.

## What the people you share with do

```
claude plugin marketplace add <the link you sent>
claude plugin install <app>@<app>
```

Then in Claude Code `/<app>:open` starts it (a local web app opens in their browser at `http://<app>.localhost:<port>`;
a command-line app answers in the chat), and `/<app>:feedback <words>` tells you something. The link signs them in, and
it is theirs alone. New versions arrive at their next start, with your "what's new". `/<app>:stop` closes what open
started (a local server, or a desktop app with every process it started), and `/<app>:forget` closes it the same way
before it deletes the sign-in, the builds and the app's data.

## A desktop app, built per OS

A desktop app (Electron, Tauri, a native binary) ships one archive per OS. In the app's `clawed.run.json`:

```json
{
  "mode": "app",
  "platforms": {
    "linux-x64": { "dir": "out/linux-x64", "run": ["./MyApp.AppImage"] },
    "darwin-arm64": { "dir": "out/darwin-arm64", "app": "MyApp.app" },
    "darwin-x64": { "dir": "out/darwin-x64", "app": "MyApp.app" }
  },
  "plugin": "claude-plugin"
}
```

`/claw deploy` (and qa) packs each `dir` as its own signed archive of the same version; a friend's computer gets only
its own (`linux-x64`, `darwin-arm64`, `darwin-x64`, `win32-x64`, `*-arm64`), and is told plainly when the version has
none for it. Each archive shows its progress as it sends (percent and MB/s) and is given up on only when nothing has gone through
for 60 s, however slow the uplink. On a Mac, `app` names the app bundle inside `dir`: the friend's launcher installs it
to `/Applications/MyApp.app` (or `~/Applications` when `/Applications` needs a password) and opens it with `open -a`, so
macOS asks for permissions as MyApp and Spotlight finds it. An update asks a running copy to quit (SIGTERM, up to 10 s,
never forced), swaps the bundle in from the checked build, and opens it again; the app's own data folder is never
touched, and no `CLAWED_*` setting reaches it. A bundle at that path with a different `CFBundleIdentifier` is never
replaced. Keep a `run` beside `app` for friends on a launcher older than 0.3.17. Elsewhere, run the app's binary itself,
so stop can close it. `plugin` names a folder whose
`skills/<name>/...`, `commands/<verb>.md` and `.mcp.json` go into every friend's `<app>` plugin beside open, stop,
feedback and forget (which stay the launcher's); `__PROJECT__` in them becomes the app's name. They reach the app with
`sh "${CLAUDE_PLUGIN_ROOT}/hooks/run.sh" --run <command words>`, which runs a command in the installed build's folder
with the app's `CLAWED_*` settings (`node` is the launcher's Node; `CLAWED_LAUNCHER` is that same run.sh, to call back into it).

## What only you can do

| Step | Why |
| :- | :- |
| Sign in once with GitHub (a code at github.com/login/device) | Clawed Apps is yours under your GitHub login |
| Choose who gets the app with `/claw share` | That is the whole access decision |
| Set a spend limit in each AI vendor's console | A backstop in case the caps or the price table are wrong |
| Rotate a key that was ever in git history | A leaked key stays leaked; only its owner can rotate it |
