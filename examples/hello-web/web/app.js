// hello-web: a static web app that calls a model from the browser with a key baked in, the way many demos start.
// The key below is fake. /ship init finds it, moves it to the claude-apps server, which then hosts this page.
const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-hello-web' // Not a real key: a placeholder baked in so you can see /ship move it off your machine.
const BASE = 'https://api.openai.com'

async function greet(name) {
  const r = await fetch(`${BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: `Say hello to ${name} in five words.` }] }),
  })
  if (!r.ok) throw new Error(`model call failed: ${r.status}`)
  return (await r.json()).choices[0].message.content
}

const $ = id => document.getElementById(id)
$('greet').onsubmit = async e => { e.preventDefault(); $('out').textContent = '…'; try { $('out').textContent = await greet($('name').value) } catch (err) { $('out').textContent = `error: ${err.message}` } }
$('fb').onsubmit = e => { e.preventDefault(); $('fbout').textContent = 'there is nowhere to send feedback yet' }
