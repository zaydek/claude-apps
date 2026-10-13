# Commands

Everything `/ship` does. You can type the words, or say what you want and Claude picks them. Each one also exists as a
tool Claude can call directly (the plugin's MCP tools), with the same words and the same answers.

## Install

```sh
claude plugin marketplace add zaydek/claude-apps
claude plugin install ship@claude-apps
```

## The words

| Say | What it does |
| :- | :- |
| `/ship` | How the app in this folder is going: what is live, who used it this week, what broke, what they said, how the stories did; and a link to your dashboard |
| `/ship init` | Sets this folder up on claude-apps. You never need it first: any word below does it on the spot and says so |
| `/ship qa` | Makes a test version and starts blind testers: one Claude agent per described user and per lens (QA: does it work; UX: does it make sense; UI: does it read right), each walking that user's stories. It says the cost and time first. `/ship qa ux` runs one lens |
| `/ship deploy` | Makes the test version live. It shows the qa table and what changed, drafts a one-line "what's new" for you to approve, and your friends see it at their next start. A red story stops it: fix first, or deploy anyway. `/ship deploy --qa` waits for a green qa; `/ship deploy --always-qa on` makes that the rule |
| `/ship rollback` | Back to the version live before |
| `/ship share sam` | Gives Sam the app: two lines they paste. `--test` gives them the test version; `--github` lets them sign in with a GitHub code (as the GitHub user `sam`) instead of the link; `--remove` takes it back |
| `/ship users` | Who used it (people and agent testers), and the described users qa plays. "Add a user: Maya, a nurse on night shifts" adds one |
| `/ship stories` | What people do with the app, and how each story did in qa (works, makes sense, useful). Say a story to add it; `stories export` writes a copy to STORIES.md |
| `/ship said` | What people and testers said that is still open; after a fix, Claude answers them and they see it at their next start |
| `/ship pause` | Stops every call at once; `--off` starts again; `--cap 5` sets the daily dollar cap |
| `/ship feedback` | Tells the claude-apps team what you think (not your app's people) |
| `/ship doctor` | Checks Node, Claude Code, your sign-in, this folder, and keys left in files; one `ok` or `fix:` line each |

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
| Sign in once with GitHub (a code at github.com/login/device) | claude-apps is yours under your GitHub login |
| Choose who gets the app with `/ship share` | That is the whole access decision |
| Set a spend limit in each AI vendor's console | A backstop in case the caps or the price table are wrong |
| Rotate a key that was ever in git history | A leaked key stays leaked; only its owner can rotate it |
