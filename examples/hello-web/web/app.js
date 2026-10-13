// hello-web: a static web app that calls a model from the browser with a key baked in, the way many demos start.
// The key below is fake. A real one, /claw finds and moves to Clawed Apps, which then hosts this page.
const ANTHROPIC_API_KEY = 'DEMO-NOT-A-REAL-KEY-hello-web' // Not a real key: it stands where yours would be, and /claw moves a real one off your machine.
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

const $ = id => document.getElementById(id)
$('greet').onsubmit = async e => { e.preventDefault(); $('out').textContent = '…'; try { $('out').textContent = await greet($('name').value) } catch (err) { $('out').textContent = `error: ${err.message}` } }
$('fb').onsubmit = e => { e.preventDefault(); $('fbout').textContent = 'there is nowhere to send feedback yet' }
