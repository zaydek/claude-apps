// hello-server: a small local web server that calls a model with a key baked in, the way many side projects start.
// The key below is fake. A real one, /claw finds and moves to Clawed Apps and rewires the call; the server
// itself then runs on each person's own machine at http://hello-server.localhost:<port>.
import http from 'node:http'

const ANTHROPIC_API_KEY = 'DEMO-NOT-A-REAL-KEY-hello-server' // Not a real key: it stands where yours would be, and /claw moves a real one off your machine.
const BASE = 'https://api.anthropic.com'

async function greet(name) {
  const r = await fetch(`${BASE}/v1/messages`, {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 60, messages: [{ role: 'user', content: `Say hello to ${name} in five words.` }] }),
  })
  if (!r.ok) throw new Error(`model call failed: ${r.status}`)
  return (await r.json()).content[0].text
}

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>hello-server</title>
<style>:root{color-scheme:light dark}body{font:16px/1.5 system-ui,sans-serif;max-width:32rem;margin:2rem auto;padding:0 16px}</style></head>
<body><h1>hello-server</h1><form id="f"><input id="n" value="world" aria-label="Name"> <button>Greet</button></form><output id="o"></output>
<script>document.getElementById('f').onsubmit=async e=>{e.preventDefault();const r=await fetch('/api/greet?name='+encodeURIComponent(document.getElementById('n').value));document.getElementById('o').textContent=(await r.json()).text}</script></body></html>`

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname === '/api/greet') {
    let text
    try { text = await greet(url.searchParams.get('name') || 'world') } catch (e) { text = `error: ${e.message}` }
    res.writeHead(200, { 'content-type': 'application/json' })
    return res.end(JSON.stringify({ text }))
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(PAGE)
})
server.listen(+(process.env.PORT || 7500), process.env.HOST || '127.0.0.1', () => console.log(`hello-server on http://127.0.0.1:${server.address().port}`))
