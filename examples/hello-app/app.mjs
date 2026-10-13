// hello-app: a tiny app with an API key baked in, the way many side projects start.
// The key below is fake. A real one, /claw finds and moves to Clawed Apps and rewires the call.
const ANTHROPIC_API_KEY = 'DEMO-NOT-A-REAL-KEY-hello-app' // Not a real key: it stands where yours would be, and /claw moves a real one off your machine.
const BASE = 'https://api.anthropic.com'

export async function greet(name) {
  const r = await fetch(`${BASE}/v1/messages`, {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 60, messages: [{ role: 'user', content: `Say hello to ${name} in five words.` }] }),
  })
  if (!r.ok) throw new Error(`model call failed: ${r.status}`)
  const j = await r.json()
  return j.content[0].text
}

console.log(await greet(process.argv[2] || 'world'))
