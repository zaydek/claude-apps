// hello-app: a tiny app with an API key baked in, the way many side projects start.
// The key below is fake. /clawed init finds it, moves it to the Clawed Apps server and rewires the call.
const OPENAI_API_KEY = 'DEMO-NOT-A-REAL-KEY-hello-app' // Not a real key: a placeholder baked in so you can see /clawed move it off your machine.
const BASE = 'https://api.openai.com'

export async function greet(name) {
  const r = await fetch(`${BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: `Say hello to ${name} in five words.` }] }),
  })
  if (!r.ok) throw new Error(`model call failed: ${r.status}`)
  const j = await r.json()
  return j.choices[0].message.content
}

console.log(await greet(process.argv[2] || 'world'))
