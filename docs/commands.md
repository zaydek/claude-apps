# Commands

Everything `/ship` can do, and when to use each. The [README](../README.md) has the short path; [llms.txt](../llms.txt)
is the version for an agent setting up a project. You never type the implementation — you say what you want, and
`/ship` does it. The verbs below are what the plugin runs underneath.

| Verb | When to use it |
| :- | :- |
| `/ship doctor` | First, and whenever something looks wrong. One `ok` or `fix: …` line per check. |
| `/ship` | No verb: shows status if the project is set up, else explains the verbs and offers to set it up. |
| `/ship init` | Set a project up: keys out, pick the shape, deploy, open the dashboard. You never have to run it first — the other verbs set the project up on the spot if needed. |
| `/ship stories` | Write or edit the app's users and stories, in plain words, before or after any code. |
| `/ship qa [ui\|ux\|qa]` | Blind testers use the current build the way people would and leave feedback on the dashboard. A lens runs one lens. |
| `/ship deploy` | Make the current build live for everyone shared with. Drafts a one-line "what's new" you approve in one step. |
| `/ship rollback` | Go back one version, the moment a live version misbehaves. No rebuild. |
| `/ship share <user>` | Allow a person and print the two lines to send them. `--key "<ssh public key>"` pins a key they send; a hosted web app can give a one-time browser link. |
| `/ship users` | Who is using the app: each person and agent tester, last seen, use this week, what they said, what broke. |
| `/ship feedback <words>` | Tell the claude-apps team what you think of claude-apps itself. Separate from your app's own feedback. |

## The loop

A first run, top to bottom:

```
/ship doctor                     # ok on every line
/ship stories                    # two users, a few stories, in your words
"put this online for my friends" # init + deploy: keys out, server up, link in hand
/ship share <github-user>        # two lines to send a friend
/ship qa                         # blind testers try it; feedback on the dashboard
/ship users                      # who used it, what they said
```

To ship a change: edit, then `/ship qa` (optionally "release it, but qa it first", which walks every user through every
story and stops on anything red), then `/ship deploy`. If a live version is wrong, `/ship rollback`.

## What only you can do

Some steps are yours, in your own terminal, and `/ship doctor` marks them `fix:` with the exact step:

- `gh auth login` (GitHub CLI signed in).
- A Fly.io card on file, only if you choose to run the server on your own Fly account.
- Rotating a key at a vendor's console — needed when a key was ever in git history or a shipped build (it is marked
  **burned**, and a release is refused until you rotate it).
- Setting a spend limit in each vendor's console, as a backstop to the caps in [limits.md](limits.md).

claude-apps never asks you to paste an API key, and never works around a login you have to do yourself.
