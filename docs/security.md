# Security

The short version: your API keys live sealed on the service, and nobody you share with ever holds one.

## Keys

The first time, `/clawed` finds the keys baked into your app's files, sends them to the service, blanks them in the
files, and tells Claude to rewire each line to call through the service instead. It never prints a key; it names the
file and line. After that, a version is refused while any file in it still holds a key.

Vendor error messages are replaced or scrubbed, so "incorrect API key" never reaches anyone, and key-shaped strings are
scrubbed from events on arrival.

## Signed versions

Every version is signed on your computer with an ed25519 key that never leaves it
(`~/.config/clawed-apps/signing-key`, mode 600). Each friend's copy of your app holds the public half and refuses a
version whose signature does not check out, so the service alone cannot ship code to anyone's computer.

## Signing in

You sign in with GitHub: a code at github.com/login/device for `/clawed`, or "Sign in with GitHub" on the dashboard. The
service asks GitHub for your login and nothing else. A friend signs in through the share link you sent: it holds a code
for them alone, which their copy of the app trades for a token of its own at its first start; `/clawed share <name>
--remove` ends both. A friend shared with `--github` can instead sign in with a GitHub code at their first start.

## Browsers

A browser session's calls must come from the app's own origin (the `Origin` header is checked, and the cookie is
`SameSite=Lax`), and a sign-in link is spent only by its Continue button, so a chat app's link preview cannot use it.

Data retention and spending caps are in [limits.md](limits.md).
