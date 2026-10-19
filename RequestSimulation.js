const BASE_URL = 'http://localhost:8080/';
const INTERVALS = [500, 450, 400, 350, 300, 250, 200, 150, 100, 50, 30, 20, 15, 10, 5, 1];
const DURATION_PER_LEVEL_MS = 1000;

function randomPayload() {
  const len = Math.floor(Math.random() * 50) + 10;
  let s = '';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function sendOne() {
  try {
    const res = await fetch(BASE_URL + randomPayload());
    const text = await res.text();
    if (text.includes('ACCESS GRANTED')) return 'success';
    return 'fail';
  } catch (e) {
    return 'fail';
  }
}

async function runLevel(intervalMs) {
  let success = 0, fail = 0;
  const start = Date.now();
  const pending = [];

  while (Date.now() - start < DURATION_PER_LEVEL_MS) {
    pending.push(sendOne().then(r => (r === 'success' ? success++ : fail++)));
    await new Promise(r => setTimeout(r, intervalMs));
  }
  await Promise.all(pending);

  const total = success + fail;
  const rate = total ? ((success / total) * 100).toFixed(1) : '0.0';
  console.log(`interval=${String(intervalMs).padStart(3)}ms  total=${String(total).padStart(4)}  success=${String(success).padStart(4)}  fail=${String(fail).padStart(4)}  successRate=${rate}%`);
}

async function main() {
  console.log('=== Load Simulation Started ===');
  for (const ms of INTERVALS) {
    await runLevel(ms);
  }
  console.log('=== Load Simulation Finished ===');
}

main();