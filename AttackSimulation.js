const BASE_URL = 'http://localhost:8080/';

async function sendRequest(payload, type) {
  try {
    const res = await fetch(BASE_URL + payload);
    const text = await res.text();
    console.log(`[${type}] Result: ${text}`);
  } catch (e) {
    console.log(`[${type}] Request failed: ${e.message}`);
  }
}

async function runTest() {
  console.log('--- Security Test Started ---');

  await sendRequest('normal_user_data', 'Normal Request');

  let bigPayload = 'A'.repeat(200);
  await sendRequest(bigPayload, 'Oversized Payload Attack');

  console.log('--- Starting High-Frequency DoS Attack (30 requests) ---');
  for (let i = 0; i < 30; i++) {
    await sendRequest('spam', 'High-Frequency Attack');
    await new Promise(r => setTimeout(r, 10));
  }
}

runTest();