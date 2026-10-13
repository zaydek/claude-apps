# Where your app runs

When you set a project up, `/clawed` asks one question: **should we host it, or will you run it yourself?** You can
change your mind later; nothing is lost.

| | Hosted by us (the default) | You run it |
| :- | :- | :- |
| What you need | Claude Code and a GitHub account | That, plus a Fly.io account, a machine with Docker, or a computer that stays on |
| Your API keys live | sealed on our service, readable only by your app's calls | on your server |
| Your dashboard | on the web, signed in with a one-time link | the same hosted dashboard, or a local one |
| Cost to you | your AI vendor's bill, under the daily caps you set | the same, plus your server |

Hosting by us is invite-only for now: the operator keeps a list of who may sign up.

## Hosted by us

The first `/clawed` signs you in with GitHub: it shows a short code, you enter it in your browser once, and the service
knows who you are. Nothing else to set up. Then your project runs under your own name at
`https://<service>/p/<you>/<project>`.

- **Your own space.** Each project has its own database. Another author cannot read your numbers, builds or keys.
- **Your keys.** Each project's vendor keys are encrypted with that project's own key, itself encrypted with the
  service's master key. Nobody reads a key back, you included — you can only replace it.
- **Your builds.** A build only reaches your friends if it carries your signature, made on your machine with a key that
  never leaves it, so not even the service can ship code in your name.
- **Read-only viewers.** You can let another author see your dashboard and change nothing.

### Sharing with people

When you `/clawed share <github-user>`, that person signs in with GitHub once the first time they open your app — the same
short-code flow, nothing to install. A browser-only friend can instead get a one-time link you hand them. Either way
nobody you share with ever holds an API key.

## You run it

Point `/clawed` at your own **Fly.io** account (a small app in `sjc`, about $2 a month idle), a machine with **Docker**,
or a plain **Node** process on this or another computer. Either way your app still reports to the same hosted dashboard,
and you can move between hosted and self-hosted later without losing a single count.

Keys, caps and retention are the same wherever it runs — see [security.md](security.md) and [limits.md](limits.md).
