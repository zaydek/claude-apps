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
| `/claw share sam` | Gives Sam the app: two lines they paste. `--test` gives them the test version; `--github` lets them sign in with a GitHub code (as the GitHub user `sam`) instead of the link; `--remove` takes it back |
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
it is theirs alone. New versions arrive at their next start, with your "what's new".

## What only you can do

| Step | Why |
| :- | :- |
| Sign in once with GitHub (a code at github.com/login/device) | Clawed Apps is yours under your GitHub login |
| Choose who gets the app with `/claw share` | That is the whole access decision |
| Set a spend limit in each AI vendor's console | A backstop in case the caps or the price table are wrong |
| Rotate a key that was ever in git history | A leaked key stays leaked; only its owner can rotate it |
